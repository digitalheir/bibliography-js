import React, {PropTypes, Component} from 'react';
import PersonName from '../bibliography/PersonName';

class LastName extends Component {
  render() {
    const name = this.props.name;

    const lss = [];
    if (name.vons.length > 0) lss.push(name.vons.join(" "));
    if (name.lastNames.length > 0) lss.push(name.lastNames.join(" "));
    return <span itemProp="familyName">
      {lss.join(' ')}
    </span>;
  }
}

//noinspection JSUnresolvedVariable
LastName.propTypes = {
  name: PropTypes.instanceOf(PersonName).isRequired
};
export default LastName;
