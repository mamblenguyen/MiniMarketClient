import React, { useState } from 'react';
import Bounce from 'react-reveal/Bounce';
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    description: '',
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const Inputs = [
    { id: 1, name: 'fullname', type: 'text', placeholder: 'Full Name' },
    { id: 2, name: 'email', type: 'email', placeholder: 'Email' },
    { id: 3, name: 'phone', type: 'number', placeholder: 'Phone Number' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    //   console.log(fullname , email ,  phone, description);
    console.log(formData);
    
    try {
      const response = await fetch(`${baseUrl}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      setMessage('Thông tin của bạn đã được gửi thành công!');
      setFormData({
        fullname: '',
        email: '',
        phone: '',
        description: '',
      });
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <form className="p-6 flex flex-col justify-center w-full lg:w-2/4 mx-auto" onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-6">
        <Bounce left>
          {Inputs.map(input => (
            <input
              key={input.id}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name]}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 ring-blue-200 transition duration-300"
            />
          ))}
        </Bounce>
      </div>

      <Bounce left>
        <div className="mt-6">
          <textarea
            name="description"
            placeholder="Your Message"
            className="w-full px-4 py-3 h-36 rounded-lg ring-blue-200 focus:ring-4 focus:outline-none transition duration-300 border border-gray-300 resize-none"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-primary px-6 py-3 w-36 mt-6">
          Submit
        </button>
      </Bounce>

      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </form>
  );
};

export default ContactForm;
