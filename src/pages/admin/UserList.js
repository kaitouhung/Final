import React, { useEffect, useState } from "react";
import { showLoading } from "../../utils/helpers";
// import axios from "../../api/axios";
import ENDPOINT from "../../api/endpoint";
import axios from "axios";
import Modal from "react-modal";
import { Routes, Route, Link } from "react-router-dom";

function UserList(props) {
  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [offset, setOffset] = useState(0);
  const [post, setPost] = useState({
    modalIsOpen: false,
    id: "",
    title: "",
    description: "",
    content: "",
    author: "",
    category: "",
    image: "",
  });
  const [modalDelete, setmodalDelete] = useState({
    modalIsOpen: false,
    id: "",
  });
  useEffect(() => {
    getUsersList();
  }, []);

  const getUsersList = async (kw = keyword, pg = page, pgSize = pageSize) => {
    try {
      const params = {
        KeyWord: kw,
        page: pg,
        pageSize: pgSize,
      };
      const res = await axios.post(ENDPOINT.USERS_LIST, params);
      console.log(res);
      //   setPostList(res.data);

      if (res.data) {
        setPostList(res.data.result);
        setTotalCount(res.data.numberOfResult);
        setOffset(res.data.offset);
      }
    } catch (error) {
      console.log("Call API Users List Error: ", error);
    }
  };

  const handleSearch = () => {
    const kw = keyword;
    getUsersList(kw);
  };

  const prevPage = async () => {
    const pg = page === 1 ? 1 : page - 1;
    getUsersList(pg);
    setPage(pg);
  };

  const nextPage = async () => {
    const pg = page < Math.ceil(totalCount / pageSize) ? page + 1 : page;
    getUsersList(pg);
    setPage(pg);
  };

  const openModal = (item) => {
    setPost({
      modalIsOpen: true,
      id: item._id,
      title: item.title,
      description: item.description,
      content: item.content,
      author: item.author,
      category: item.category,
      image: item.image,
    });
  };

  const oepnModalDelete = (item) => {
    setmodalDelete({
      id: item._id,
      modalIsOpen: !modalDelete.modalIsOpen,
    });
    // closeModalDelete();
  };
  const closeModalDelete = () => {
    setmodalDelete({
      ...modalDelete,
      modalIsOpen: !modalDelete.modalIsOpen,
    });
  };
  const handleDelete = async () => {
    console.log(modalDelete);
    const newsId = {
      id: modalDelete.id,
    };
    setPostList(postList.filter((post) => post._id !== modalDelete.id));
    const response = await axios.post(
      "http://localhost:3001/delete-post",
      newsId
    );
    closeModalDelete();
  };

  const closeModal = () => {
    setPost({
      modalIsOpen: false,
    });
  };
  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setPost({
      ...post,

      [name]: value,
    });
  };
  const handleChangeImage = (event) => {
    const file = event.target.files[0];

    setPost({
      ...post,
      [event.target.name]: file,
    });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    let formData = new FormData();
    formData.append("image", post.image);
    formData.append("id", post.id);

    formData.append("title", post.title);
    formData.append("description", post.description);
    formData.append("content", post.content);
    formData.append("author", post.author);
    formData.append("category", post.category);

    try {
      const axiosClient = axios.create({
        baseURL: "http://localhost:3001/update-post",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await axiosClient.post("", formData);
      setPostList(
        postList.map((item) =>
          item._id === post.id
            ? {
                ...item,
                title: post.title,
                description: post.description,
                content: post.content,
                author: post.author,
                category: post.category,
                image: response.data.image,
              }
            : item
        )
      );
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const customStyles = {
    content: {
      width: "50%",
      height: "50%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const customStylesModalDelete = {
    content: {
      width: "30%",
      height: "30%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const thCls =
    "px-3 py-3 border-b-2 border-gray-200 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-left";
  const tdCls = "px-3 py-2 text-sm text-left";

  return (
    <>
      <div className="px-2 py-5  bg-gray-100">
        <div className="px-4 px-8 py-4 overflow-x-auto">
          <div className="searchbox">
            <div className="flex items-center justify-between">
              {/* <input
                type="text"
                className="focus:border-blue-500 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                placeholder="Search..."
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button
                type="button"
                className="ml-4 align-middle bg-blue-500 hover:bg-blue-600 text-center px-4 py-2 text-white text-sm font-semibold rounded inline-block shadow-lg"
                onClick={handleSearch}
              >
                Search
              </button> */}
              <div className="float-right">
                {/* <button className="btn btn-success">Add New Post</button> */}
                <Link
                  to="/add-post"
                  className="ml-4 align-middle bg-green-500 hover:bg-green-600 text-center px-4 py-2 text-white text-sm font-semibold rounded inline-block shadow-lg"
                >
                  <p>Add New Post</p>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full border-collapse border-2 border-gray-500 leading-normal">
              <thead>
                <tr>
                  <th className={thCls}>Title</th>
                  <th className={thCls}>Description</th>
                  <th className={thCls}>Content</th>
                  <th className={thCls}>Author</th>
                  <th className={thCls}>Category</th>
                  <th className={thCls}>Image</th>
                  <th className={thCls}>Actions</th>
                </tr>
              </thead>
              <tbody className="customer-list">
                {postList.map((item) => (
                  <tr
                    key={item._id}
                    className="cursor-pointer bg-white even:bg-gray-100 hover:bg-gray-200"
                  >
                    <td className={tdCls}>{item.title}</td>
                    <td className={tdCls}>{item.description}</td>
                    <td className={tdCls}>{item.content}</td>
                    <td className={tdCls}>{item.author}</td>
                    <td className={tdCls}>{item.category}</td>
                    <td className={tdCls}>
                      <img src={item.image} className="w-30 h-30" />
                    </td>
                    <td className={tdCls}>
                      <button
                        type="button"
                        className="w-20 h-10 mb-2 rounded-full bg-blue-600"
                        onClick={() => openModal(item)}
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="w-20 h-10 mb-2 rounded-full bg-red-600"
                        onClick={() => oepnModalDelete(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
              <span className="text-xs xs:text-sm text-gray-900">
                Showing {totalCount === 0 ? 0 : offset + 1} to{" "}
                {offset + pageSize > totalCount
                  ? totalCount
                  : offset + pageSize}{" "}
                of {totalCount} Records
              </span>
              <div className="inline-flex mt-2 mt-0">
                <button
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                  onClick={prevPage}
                >
                  Prev
                </button>
                <button
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                  onClick={nextPage}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <Modal
            isOpen={post.modalIsOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
            style={customStyles}
            shouldCloseOnOverlayClick={false}
            contentLabel="Update Post"
          >
            <button
              className="ml-4 align-middle bg-red-500 hover:bg-red-600 text-center px-4 py-2 text-white text-sm font-semibold rounded inline-block shadow-lg"
              onClick={closeModal}
            >
              Close
            </button>
            <form onSubmit={handleEditSubmit}>
              <table className="border-collapse border border-gray-400 text-left m-3">
                <tbody>
                  <tr>
                    <th className="border border-gray-300">
                      <label>Title</label>
                    </th>
                    <td className="border border-gray-300">
                      <input
                        type="text"
                        name="title"
                        value={post.title}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>

                  <tr className="border border-gray-300">
                    <th className="border border-gray-300">
                      <label>Description</label>
                    </th>
                    <td className="border border-gray-300">
                      <textarea
                        className=""
                        type="text"
                        name="description"
                        value={post.description}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>

                  <tr>
                    <th className="border border-gray-300">
                      <label>Content</label>
                    </th>
                    <td className="border border-gray-300">
                      <textarea
                        type="text"
                        name="content"
                        value={post.content}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300">
                      <label>Category</label>
                    </th>
                    <td className="border border-gray-300">
                      <input
                        type="text"
                        name="category"
                        value={post.category}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300">
                      <label>Author</label>
                    </th>
                    <td className="border border-gray-300">
                      <input
                        type="text"
                        name="author"
                        value={post.author}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300">
                      <label>Image</label>
                    </th>
                    <td className="border border-gray-300">
                      {/* <img src={post.image} style={{ width: 100, height: 100 }} /> */}
                      <input
                        name="image"
                        type="file"
                        onChange={handleChangeImage}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className="ml-4 align-middle bg-blue-500 hover:bg-blue-600 text-center px-4 py-2 text-white text-sm font-semibold rounded inline-block shadow-lg"
                type="submit"
              >
                Edit
              </button>
            </form>
          </Modal>
          <Modal
            isOpen={modalDelete.modalIsOpen}
            onRequestClose={closeModalDelete}
            ariaHideApp={false}
            style={customStylesModalDelete}
            shouldCloseOnOverlayClick={false}
            contentLabel="Delete Post"
          >
            <button
              className="ml-4 align-middle bg-red-500 hover:bg-red-600 text-center px-4 py-2 text-white text-sm font-semibold rounded inline-block shadow-lg"
              onClick={closeModalDelete}
            >
              Close
            </button>
            <form>
              <table className="min-w-full mb-10 mt-3 text-center">
                <tbody>
                  <tr className="text-center">Are you sure ?</tr>
                </tbody>
              </table>
              <button
                className="ml-4 align-middle bg-blue-500 hover:bg-blue-600 text-center px-4 py-2 text-white text-sm font-semibold rounded inline-block shadow-lg"
                type="submit"
                onClick={handleDelete}
              >
                Yes
              </button>
              <button
                className="ml-4 align-middle bg-red-500 hover:bg-red-600 text-center px-4 py-2 text-white text-sm font-semibold rounded inline-block shadow-lg"
                onClick={closeModalDelete}
              >
                No
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default UserList;
