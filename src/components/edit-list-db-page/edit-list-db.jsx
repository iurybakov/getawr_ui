import React, { Component } from 'react';
import AppBarAwr from '../common/app-bar-awr';
import TableEditDB from './table/table-db-edit';

class EditListDB extends Component {
  state = {  }
  render() { 
    return ( 
      <React.Fragment>
        <AppBarAwr/>
        <TableEditDB/>
      </React.Fragment>
     );
  }
}
 
export default EditListDB;