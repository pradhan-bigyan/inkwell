import React from "react";

const EmailInput = ({ value, onChange }) => {
  return (
    <>
      <label for="email">Email*</label>
      <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded-2xl mb-3">
        <input
          name="email"
          onChange={onChange}
          value={value}
          type="text"
          placeholder="Email"
          className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
        />
      </div>
    </>
  );
};

export default EmailInput;
