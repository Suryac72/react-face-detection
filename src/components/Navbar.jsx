import React from 'react';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <div>
               <p>{this.props.expression}</p>
            </div>
        )
    }
}
 export default Navbar;
