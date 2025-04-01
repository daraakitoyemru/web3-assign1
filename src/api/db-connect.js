const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Create Supabase client with proper encoding options
const db = createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }
});

const jsonMsg = (message) => {
  return { message: message };
};

// Function to properly encode special characters in database responses
const encodeSpecialChars = (data) => {
  if (!data) return data;
  
  // If it's an array, process each item
  if (Array.isArray(data)) {
    return data.map(item => encodeSpecialChars(item));
  }
  
  // If it's an object, process each property
  if (typeof data === 'object' && data !== null) {
    const result = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // If the value is a string, decode and re-encode it
        if (typeof data[key] === 'string') {
          result[key] = data[key]
            .replace(/�/g, 'á')
            .replace(/�/g, 'é')
            .replace(/�/g, 'í')
            .replace(/�/g, 'ó')
            .replace(/�/g, 'ú')
            .replace(/�/g, 'ü')
            .replace(/�/g, 'ñ');
        } else {
          result[key] = encodeSpecialChars(data[key]);
        }
      }
    }
    return result;
  }
  
  return data;
};

module.exports = { db, jsonMsg, encodeSpecialChars };
