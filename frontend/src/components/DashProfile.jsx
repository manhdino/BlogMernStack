import { Alert, Button, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import AlertMessage from "./AlertMessage";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  //Pick file image
  const filePickerRef = useRef();

  // handleFileChange
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file)); //create url for file image
    }
  };

  // every time we update the image file avatar, automatically update in to the DB
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  // handle update image file avatar
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); //show progress % loading image in firebase
  const [imageFileUploadError, setImageFileUploadError] = useState(null); //show error loading such as > 2MB or not correct type image file
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUpComplete, setImageFileUpComplete] = useState(false); // check if image file is uploaded successfully and then allow to update
  const uploadImage = async () => {
    //upload image in firebase get url image dynamically

    // config store in firebase
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write:if
    //       request.resource.size < 2*1024*1024
    //       && request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }

    //setImageFileUploading(true);
    setImageFileUploadError(null);
    setImageFileUpComplete(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name; //create a unique filename
    const storageRef = ref(storage, fileName);

    //uploadTask: method to upload image on storage in firebase and return the amount of bytes that being uploaded
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0)); //rounded decimal number(10.234->10)
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null); // not show progress bar
        setImageFile(null); // get previous image file in DB
        setImageFileUrl(null); // get previous image file url in DB
        setImageFileUpComplete(false); //upload new image file failed
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); //get image url dynamically from storage on firebase
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUpComplete(false); //upload new image file done
        });
      }
    );
  };

  //handle change form
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  //handle submit form(update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }

    if (imageFileUpComplete) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  // signout
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      {/*  form submit */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* alert message */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        {/* show avatar img and handle when change img*/}
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <div className="w-full h-full absolute top-0 left-0">
              <CircularProgressbarWithChildren
                value={imageFileUploadProgress || 0}
                strokeWidth={5}
                styles={{
                  path: {
                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadProgress / 100
                    })`,
                  },
                }}
              >
                {imageFileUploadProgress && imageFileUploadProgress < 100 && (
                  <>
                    <img
                      style={{ width: 40, marginTop: -5 }}
                      src="https://i.imgur.com/b9NyUGm.png"
                      alt="doge"
                    />
                    <div style={{ fontSize: 12, marginTop: -5 }}>
                      <strong>{imageFileUploadProgress}%</strong> mate
                    </div>
                  </>
                )}
              </CircularProgressbarWithChildren>
            </div>
          )}

          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-4 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-15"
            }`}
          />
        </div>

        {/* show error message upload new image from laptop > 2MB */}
        {imageFileUploadError && (
          <AlertMessage
            message={imageFileUploadError}
            status="failure"
            timing={2000}
          />
        )}

        {updateUserSuccess && (
          // <Alert color="success">{updateUserSuccess}</Alert>
          <AlertMessage message={updateUserSuccess} status="success" />
        )}
        {updateUserError && (
          <AlertMessage message={updateUserError} status="failure" />
        )}
        {error && <AlertMessage message={error} status="failure" />}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUpComplete}
        >
          {loading ? "Loading..." : "Update"}
        </Button>

        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
    </div>
  );
}
