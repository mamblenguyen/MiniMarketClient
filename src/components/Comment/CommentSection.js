import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import swal from "sweetalert";
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

const CommentSection = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // id comment đang reply
  const [replyText, setReplyText] = useState("");
  const token = localStorage.getItem("accessToken");
  const user = token ? jwtDecode(token) : null;

  // Lấy tất cả comment (bao gồm cả con)
  useEffect(() => {
    if (!productId) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/comments/product/${productId}`
        );
        if (!res.ok) throw new Error("Lỗi khi tải bình luận");
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Lỗi tải bình luận:", error);
        setComments([]);
      }
    };

    fetchComments();
  }, [productId]);

  const handleSendComment = async (parentId = null) => {
    const content = parentId ? replyText : text;
    if (!content.trim()) return;

    try {
      const res = await fetch(`${baseUrl}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          userId: user?.id,
          userName: user?.name || user?.username || "Ẩn danh",
          avatar: user?.avatar || null,
          content,
          parentId,
        }),
      });
      if (!res.ok) throw new Error("Gửi bình luận thất bại");

      if (parentId) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setText("");
      }

      // Load lại comment sau khi gửi
      const newComments = await fetch(
        `${baseUrl}/comments/product/${productId}`
      );
      const data = await newComments.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteComment = async (commentId) => {
    const confirmDelete = await swal({
      title: "Xác nhận xóa bình luận?",
      text: "Bạn có chắc chắn muốn xóa bình luận này không?",
      icon: "warning",
      buttons: {
        cancel: "Hủy",
        confirm: {
          text: "Xóa",
          value: true,
          visible: true,
          className: "bg-red-500 text-white",
          closeModal: true,
        },
      },
      dangerMode: true,
    });

    if (confirmDelete) {
      try {
        const res = await fetch(
          `${baseUrl}/comments/${productId}/${commentId}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) throw new Error("Xóa thất bại");

        // Load lại comment
        const newComments = await fetch(
          `${baseUrl}/comments/product/${productId}`
        );
        const data = await newComments.json();
        setComments(data);
      } catch (err) {
        console.error("Lỗi xóa bình luận:", err);
      }
    }
  };

  // Hàm render đệ quy comment và reply
  const renderComments = (parentId = null) => {
    return comments
      .filter((c) => {
        if (parentId === null || parentId === undefined) {
          return !c.parentId;
        }
        return c.parentId === parentId;
      })
      .map((comment) => (
        <div key={comment.id} className="pl-4 mt-3 border-l border-gray-300">
          <div className="flex items-center space-x-2">
            <img
              src={
                comment.avatar ||
                "https://cdn-icons-png.flaticon.com/512/236/236832.png"
              }
              className="w-6 h-6 rounded-full"
              alt="avatar"
            />
            <span className="font-semibold">
              {comment.userName || comment.userId}
            </span>
            <span className="text-sm text-gray-400">
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleString()
                : "Đang tải..."}
            </span>
          </div>
          <p className="ml-8 mt-1 text-gray-700">{comment.content}</p>

          {/* Nút reply */}
          <div className="ml-8 mt-2">
            <button
              className="text-blue-500 text-sm hover:underline"
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
            >
              {replyingTo === comment.id ? "Hủy trả lời" : "Trả lời"}
            </button>

            {/* Nút xóa nếu đúng người dùng */}
            {user?.id === comment.userId && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="ml-4 text-red-500 text-sm hover:underline"
              >
                Xóa
              </button>
            )}

            {/* Input reply hiện khi đang reply */}
            {replyingTo === comment.id && (
              <div className="mt-2">
                <textarea
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Viết trả lời của bạn..."
                ></textarea>
                <button
                  onClick={() => handleSendComment(comment.id)}
                  className="mt-1 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Gửi trả lời
                </button>
              </div>
            )}

            {/* Render reply con */}
            {renderComments(comment.id)}
          </div>
        </div>
      ));
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-2">Bình luận</h2>

      {/* Viết bình luận mới */}
      <div className="mb-4">
        <textarea
          rows={3}
          className="w-full p-2 border border-gray-300 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Viết bình luận của bạn..."
        ></textarea>
        <button
          onClick={() => handleSendComment()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Gửi bình luận
        </button>
      </div>

      {/* Hiển thị danh sách bình luận */}
      <div>{renderComments()}</div>
    </div>
  );
};

export default CommentSection;
