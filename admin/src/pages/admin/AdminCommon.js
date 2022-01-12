import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { path } from "src/constants/path";
import { unauthorize } from "src/pages/Auth/auth.slice";

function AdminCommon(props) {
  const history = useHistory();

  // useEffect(() => {
  //   const token = localStorage.getItem(APP_CONSTANTS.USER_TOKEN);
  //   if (!token) {
  //     history.replace("/login");
  //   }
  // });
  const [formValue, setformValue] = useState({
    file: "",
    imagePreviewUrl: "",
  });
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(unauthorize());
    history.push(path.login);
  };
  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setformValue({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };
  let { imagePreviewUrl } = formValue.imagePreviewUrl;
  let $imagePreview = null;
  if (imagePreviewUrl) {
    $imagePreview = imagePreviewUrl;
  } else {
    $imagePreview = "//logo.clearbit.com/spotify.com";
  }
  console.log(formValue);
  return (
    <div className="min-h-screen bg-gray-200">
      <nav className="flex items-center justify-between flex-wrap p-6">
        <div className="flex items-center flex-no-shrink text-white mr-6">
          <img
            src={$imagePreview}
            alt=""
            className="max-w-full"
            style={{ maxHeight: 100, maxWidth: 150 }}
          />
        </div>
        <div className="mt-4 lg:mt-0 w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow flex items-center divide-x">
            <form>
              <input
                className="fileInput"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
              />
              <button
                className="text-sm bg-green-300 hover:bg-green-400 text-gray-800 font-semibold py-2 px-4 rounded"
                type="submit"
              >
                Upload Image
              </button>
            </form>
            {/* <input
              className="block lg:inline-block lg:mt-0 text-blue-700 hover:text-blue-400 px-2"
              type="file"
            /> */}
          </div>
          <div className="flex items-center" onClick={handleLogout}>
            <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">
              Logout
            </button>
          </div>
        </div>
      </nav>
      {props.children}
    </div>
  );
}

export default AdminCommon;
