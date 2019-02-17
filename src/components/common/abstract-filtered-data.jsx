import { Component } from "react";
import { requestContent } from "./requests";

class AbstractFilterDataForTable extends Component {
  /*
  Небходимые свойства объекта state
  
  state = {
    filterDraft: { name: "", host: "", port: "" },
    page: 0,
    numAllRows: 0,
    data: [],
    isLoad: true,
    isNotFound: false
  };
  */

  constructor(props, numRows) {
    super(props);
    this.innerMeta = {};
    this.innerMeta.numRows = numRows;
    this.innerMeta.filter = {};
    this.innerMeta.endPointRequest = "unknown";
    this.innerMeta.typeRequest = "unknown";
    this.forbidenCallBack = () => {
      sessionStorage.setItem("isAuth", "0");
      sessionStorage.setItem("role", "");
      this.setState({ forbidden: true, isOpenModal: false, isLoad: false });
    };
    this.innerMeta.initMethod = () => {
      requestContent(
        this.innerMeta.endPointRequest,
        this.innerMeta.typeRequest,
        { pageNumber: 0, countRowsPerPage: numRows },
        resp => {
          this.setState({
            data: resp.body.data,
            numAllRows: resp.body.properties.allRows,
            isLoad: false
          });
        }, this.forbidenCallBack
      );
    };
  }

  handleCloseSnackbar = () => {
    this.setState({ isOpenSnackbar: false });    
  };

  handleChangePage = (event, numRequirePage) => {
    if (this.state.isLoad) return;
    const { endPointRequest, typeRequest, numRows, filter } = this.innerMeta;
    this.setState({ data: [], page: numRequirePage, isLoad: true });
    requestContent(
      endPointRequest,
      typeRequest,
      { pageNumber: numRequirePage, countRowsPerPage: numRows, ...filter },
      resp => {
        this.setState({
          data: resp.body.data,
          numAllRows: resp.body.properties.allRows,
          isLoad: false
        });
      }, this.forbidenCallBack
    );
  };

  handleDeleteFilter = () => {
    let isntFilterEmpty = false;
    let isntFilterDraftEmpty = false;
    const { endPointRequest, typeRequest, numRows } = this.innerMeta;
    for (const key in this.state.filterDraft)
      if (this.state.filterDraft[key] !== "") {
        isntFilterDraftEmpty = true;
        break;
      }

    for (const key in this.innerMeta.filter)
      if (this.innerMeta.filter[key] !== "") {
        isntFilterEmpty = true;
        break;
      }

    if (isntFilterDraftEmpty) {
      const { filterDraft } = this.state;
      for (const key in filterDraft) filterDraft[key] = "";
      this.setState({ filterDraft: filterDraft });
    }

    if (isntFilterEmpty) {
      this.innerMeta.filter = {};
      this.setState({ data: [], page: 0, isLoad: true });
      requestContent(
        endPointRequest,
        typeRequest,
        { pageNumber: 0, countRowsPerPage: numRows },
        resp => {
          this.setState({
            data: resp.body.data,
            numAllRows: resp.body.properties.allRows,
            isLoad: false,
            isNotFound: false
          });
        }, this.forbidenCallBack
      );
    }
  };

  handleChangeFilter = name => event => {
    const { filterDraft } = this.state;
    filterDraft[name] = event.target.value;
    this.setState({ filterDraft: filterDraft });
  };

  refreshPage = (page) => {
    const { endPointRequest, typeRequest, numRows, filter } = this.innerMeta;
    requestContent(
      endPointRequest,
      typeRequest,
      { pageNumber: page, countRowsPerPage: numRows, ...filter },
      resp => {
        this.setState({
          data: resp.body.data,
          numAllRows: resp.body.properties.allRows,
          isLoad: false,
          isNotFound: resp.body.data.length === 0
        });
      }, this.forbidenCallBack
    );
  };

  handleApplyFilter = () => {
    let isntFilterEmpty = false;
    for (const key in this.state.filterDraft)
      if (this.state.filterDraft[key] !== "") {
        isntFilterEmpty = true;
        break;
      }

    if (isntFilterEmpty) {
      this.innerMeta.filter = {};
      for (const key in this.state.filterDraft)
        if (this.state.filterDraft[key] !== "")
          this.innerMeta.filter[key] = this.state.filterDraft[key];
      const { endPointRequest, typeRequest, numRows, filter } = this.innerMeta;
      this.setState({ data: [], page: 0, isLoad: true });
      requestContent(
        endPointRequest,
        typeRequest,
        { pageNumber: 0, countRowsPerPage: numRows, ...filter },
        resp => {
          this.setState({
            data: resp.body.data,
            numAllRows: resp.body.properties.allRows,
            isLoad: false,
            isNotFound: resp.body.data.length === 0
          });
        }, this.forbidenCallBack
      );
    }
  };
}

export default AbstractFilterDataForTable;
