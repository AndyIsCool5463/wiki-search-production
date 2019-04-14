import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
// Importing CSS from @material-ui/core | @material-ui/icons
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { Button } from "@material-ui/core";
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from "@material-ui/core";
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  root: {
    background: "white"
  },
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
});
class App extends Component {
  state = {
    input: "",
    jsonResponse: [],
    QuerySize: 10,
    openHistory: false,
    check: false
  }
  updateInputState(e) {
      this.setState({input: e.target.value})  
  }
  updateQueryState(e) {
    this.setState({QuerySize: e.target.value})
  }
  formSubmit(e) {
    const searchURL = `https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&limit=${this.state.QuerySize}&search=`;
    // where all the magic happens!
    e.preventDefault();
    var input = this.state.input;
    // TODO: make this that thing: !input ? ... : ...
    if(!input) {
      // TODO: make something appear, clean up with Material UI :)
      console.log('no input!')
    }else {
        fetch(searchURL + input,).then(res => res.json()).then(data => {
          this.handleData(data);
        })
        var newHistory = JSON.parse(localStorage.getItem("searchHistory"));
        console.log("AAAAAAAAAAAAAAA"+newHistory)
        newHistory.push({
          date: new Date().toDateString(),
          searchTerm: input
        })
        localStorage.setItem("searchHistory", JSON.stringify(newHistory))
    }
  }
  handleData(data) {
    console.log(data);
    /* 
    DATA ARRAY DICTIONARY: 
   FROM 0-3;
   INDEX 0: Search Term.
   INDEX 1: Possible Terms.
   INDEX 2: Definitions for Those Terms In Order.
   INDEX 3: Links to Them.
    */
    this.setState({jsonResponse: data})
  }
  changeHistory() {
    let history = this.state.openHistory;
    history ? this.setState({openHistory: false}) : this.setState({openHistory: true})
  }
  handleModeChange() {
    if(this.state.check === true) {
      this.setState({ check: false })
      localStorage.setItem("mode", "light")
    } else {
      this.setState({ check: true});
      localStorage.setItem("mode", "dark")
    }
    var mode = localStorage.getItem("mode");
    if(!mode) { localStorage.setItem("mode", "light")}
    
  }
  componentDidMount() {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#insertion-point-jss'),
    );
  }
  render() {
  var a = localStorage.getItem("searchHistory");
  console.log(a)
  if(a === null) {
    console.log("SETTING THE STORAGE THING.")
      localStorage.setItem("searchHistory", JSON.stringify([]));
      localStorage.getItem('searchHistory');
  }
    if(typeof JSON.parse(localStorage.getItem("searchHistory")) != "object") {
      console.log("SETTING THE STORAGE THING.")
      localStorage.setItem("searchHistory", JSON.stringify([]));
      localStorage.getItem('searchHistory');
    }
    const { classes } = this.props;
    return ( 
      <div className={"App"}>
      <CssBaseline /> 
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Wikipedia_Banner.svg/1280px-Wikipedia_Banner.svg.png"/>
        <Typography align="center" variant="h4" onClick={() => alert("Made by Andy. \n Github: check index.html :)")}>
          WikiSearch
          </Typography>
          <Typography align="center" variant="caption">
            Search Wikipedia without even being on it!
          </Typography>
        <form className={classes.form}onSubmit={(e) => this.formSubmit(e)}>
          <FormControl margin="normal" autocomplete="off" required>
          <InputLabel htmlFor="search">Search: </InputLabel>
          <Input name="search"  autocomplete="off" placeholder="Wikipedia" onChange={(e) => this.updateInputState(e)}/>
          </FormControl>
          <FormControl margin="normal">
          <InputLabel htmlFor="quantity">Queries: </InputLabel>
          <Input type="number" name="quantity" placeholder="10" min="1" max="500" onChange={e => this.updateQueryState(e)}/>
          </FormControl>
          
          <RenderButton isDisabled={this.state.input} classes={classes}/>
          <Button variant="primary" color="blue" onClick={() => this.changeHistory()}>{this.state.openHistory ? "Hide" : "View"} Search History</Button>
        </form>
        <hr />
    { this.state.openHistory ? <RenderHistory classes={classes}/> : <RenderSearch data={this.state.jsonResponse}/> } 
      </div>
    );
  }
}
class RenderHistory extends Component {
  render() {
    const { classes } = this.props;
    const historyArray = JSON.parse(localStorage.getItem("searchHistory"));
    return(
      <div>
      <Typography align="center" variant="title">Search History</Typography>
      <div>
        <Table>
          <TableHead>
          <TableCell>Date</TableCell>  
          <TableCell>Search Query</TableCell>  
         <TableCell>Delete</TableCell> 
          </TableHead>
          <TableBody>
          <RenderSearchHistoryTable classes={classes} data={historyArray}/>
          </TableBody>
        </Table>
      </div>
      </div>
    )
  }
}
class RenderSearchHistoryTable extends Component {
  deleteItem(e) {
    const id = e.target.id;
    if(!localStorage.getItem("searchHistory")) {
      localStorage.setItem("searchHistory", JSON.stringify([]));
    }
    const history = JSON.parse(localStorage.getItem("searchHistory"));
    var newHistory = [...history];
    newHistory.splice(id, 1);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory))
  }
  state = {
    a: this.props.data
  }
  render() {
    const { classes } = this.props;
    const data = this.state.a.reverse(); // this is done to not mutate the actual array ty wes bos
    return(
      <>
      {data.map((c, i) => {
        return(
          <TableRow key={i}>
          <TableCell>{c.date}</TableCell>
          <TableCell>{c.searchTerm}</TableCell>
          <TableCell><Button id={i} onClick={(e) => this.deleteItem(e)}>Delete</Button></TableCell>
        </TableRow>
        )
      })}
      </>
    )
  }
}
class RenderButton extends Component {

  render() {
    const { classes } = this.props;
    return this.props.isDisabled ? <Button size="small" color="primary" variant="outlined" className={classes.margin} type="submit">Search!</Button> : <Button disabled size="small" className={classes.margin} type="submit">Search!</Button>
    
  }
}
class RenderSearch extends Component {
  render() {
    const data = this.props.data;
    console.log(data);
    if(data.length <= 0) {
      return(
        <></>
      )
    }
    return(
      <div>
      <div>
        <Typography align="center" variant="headline">Results:</Typography>
      </div>
      <div>
        <Table style={{ border: "1px solid black"}}>
          <TableHead style={{ border: "1px solid black"}}>
          <TableCell>Possible Defx</TableCell>  
          <TableCell>Definition</TableCell>  
          <TableCell>Link</TableCell> 
          </TableHead>
          <TableBody style={{ border: "1px solid black"}}>
            <RenderTable data={data}/>
          </TableBody>
        </Table>
      </div>
      </div>
    )
  }
}
class RenderTable extends Component {
  render() {
    const data = this.props.data;
    console.log(data[1]);
    return(
      <>
      {data[1].map((c, i) => {
        return(
        <TableRow key={i}>
          <TableCell>{c}</TableCell>
          <TableCell>{data[2][i]}</TableCell>
          <TableCell><Link href={data[3][i]}>Read More...</Link></TableCell>
        </TableRow>
          )
      })}
      </>
    )
  }
}
// Prop Types
App.propTypes = {
  classes: PropTypes.object.isRequired,
};
RenderButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
