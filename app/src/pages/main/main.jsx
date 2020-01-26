import React from 'react';
import { connect } from 'react-redux';
import { changeMessage } from '../../redux/components/home/homeSlice';
import Solid from '../../components/Solid/Solid';

class Main extends React.Component {
  render() {
    return (
      <div>
        Message of the day: {this.props.home.message}
        <br />
        <Solid />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  home: state.home,
});
const mapDispatch = { changeMessage };

export default connect(mapStateToProps, mapDispatch)(Main);
