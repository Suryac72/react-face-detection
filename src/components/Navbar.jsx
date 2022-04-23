import React from 'react';

function Navbar() {
  return (
    <h1>{localStorage.getItem('expressions')}</h1>
    
  )
}

export default Navbar;
