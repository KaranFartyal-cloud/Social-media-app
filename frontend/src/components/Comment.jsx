import React from "react";

const Comment = ({ picture, username, id, text }) => {
  return (
    <div className="flex items-center gap-3 mt-4 mb-6 ">
      <img
        src={picture}
        alt="User"
        className="w-9 h-9 rounded-full object-cover"
      />
      <span className="font-[500]">{username}</span>
      <span className="text-gray-900 text-base">{text}</span>
    </div>
  );
};

export default Comment;
