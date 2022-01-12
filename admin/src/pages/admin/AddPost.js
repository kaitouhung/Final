import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function AddPost() {
  const [formValue, setformValue] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    category: "",
  });
  const history = useHistory();
  const [previewSource, setPreviewSource] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formValue.image);

    let formData = new FormData();
    formData.append("image", formValue.image);

    formData.append("title", formValue.title);
    formData.append("description", formValue.description);
    formData.append("content", formValue.content);
    formData.append("author", formValue.author);
    formData.append("category", formValue.category);

    try {
      const axiosClient = axios.create({
        baseURL: "http://localhost:3001/create-post",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await axiosClient.post("", formData);
      console.log(response.status);

      history.replace("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };
  const handleChangeImage = (event) => {
    const file = event.target.files[0];

    setformValue({
      ...formValue,
      [event.target.name]: file,
    });
  };
  return (
    <>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Add New Post
            </h3>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            method="POST"
          >
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="title"
                        value={formValue.title}
                        onChange={handleChange}
                        className="border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="description"
                        value={formValue.description}
                        onChange={handleChange}
                        className="border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    for="about"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Content
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="content"
                      value={formValue.content}
                      onChange={handleChange}
                      rows="3"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-400 rounded-md"
                    ></textarea>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Author
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="author"
                        value={formValue.author}
                        onChange={handleChange}
                        className="border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="category"
                        value={formValue.category}
                        onChange={handleChange}
                        className="border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          for="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="image"
                            type="file"
                            // className="sr-only"
                            onChange={handleChangeImage}
                          />
                        </label>
                        {/* <p className="pl-1">or drag and drop</p> */}
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
