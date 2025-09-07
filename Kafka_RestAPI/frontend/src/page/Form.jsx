import axios from 'axios';
import React, { useState } from 'react';
import './style/form.css';

const FormComponent = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [age, setAge] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [isEligible, setIsEligible] = useState('');
  const [gender, setGender] = useState('');
  const [hobbies, setHobbies] = useState(['', '']); // State specifically for hobbies

  let timeout; // Make sure this is defined in the appropriate scope
  let count = 0; // Initialize count

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Count:", count++); // Track click count
  
  
    clearTimeout(timeout); // Clear previous timeout

    timeout = setTimeout(async () => {
    try {
      const data = {name,age,price,birthDate,bloodGroup,email,country,bio,isEligible,gender, hobbies
      };
  
      // Using axios to send the data
      const response = await axios.post('http://localhost:9000/v1/signup', data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      console.log(response); // Log the response from the server
      alert(response.data.message); // Display message from server
  
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again.");
    }
  }, 2000);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <br />
      <br />
      <br />

      <label>
        Price:
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </label>
      <br />
      <br />
      <br />
      <label>
        Age:
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
      </label>
      <br />
      <br />
      <br />
      <label>
        Birth Date:
        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
      </label>
      <br />
      <br />
      <br />
      <label>
        Blood Group:

        <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required>

        <option value="" disabled>select blood group</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
        </select>

       
      </label>
      <br />
      <br />
      <br />
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <br />
      <br />
      <br />
      
      {/* Hobbies input handling */}
      <label>
        Hobbies:
        <input
          type="text"
          value={hobbies[0]}
          onChange={(e) => setHobbies([e.target.value, hobbies[1]])}
          placeholder="Enter your first Hobby"
          required
        />
        <input
          type="text"
          value={hobbies[1]}
          onChange={(e) => setHobbies([hobbies[0], e.target.value])}
          placeholder="Enter your second Hobby"
          required
        />
      </label>
      <br />
      <br />
      <br />

      {/* Country selection */}
      <label>
        Country:
        <select value={country} onChange={(e) => setCountry(e.target.value)} required>
          <option value="">Select Country</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="India">India</option>
          <option value="UK">UK</option>
        </select>
      </label>
      <br />
      <br />
      <br />
      {/* Bio input */}
      <label>
        Bio:
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} required />
      </label>
      <br />
      <br />
      <br />
      {/* Is Eligible radio buttons */}
      <div>
        <label>Is Eligible:</label>
        <label>
          <input
            type="radio"
            value="true"
            checked={isEligible === 'true'}
            onChange={(e) => setIsEligible(e.target.value)}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            value="false"
            checked={isEligible === 'false'}
            onChange={(e) => setIsEligible(e.target.value)}
          />
          No
        </label>
        <br />
      <br />
      <br />
      </div>

      {/* Gender radio buttons */}
      <div>
        <label>Gender:</label>
        <label>
          <input
            type="radio"
            value="male"
            checked={gender === 'male'}
            onChange={(e) => setGender(e.target.value)}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            value="female"
            checked={gender === 'female'}
            onChange={(e) => setGender(e.target.value)}
          />
          Female
        </label>
        <br />
      <br />
      <br />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default FormComponent;
