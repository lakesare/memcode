import AsyncSelect from 'react-select/async';
import css from './index.scss';

import api from '~/api';

class UserSelect extends React.Component {
  loadOptions = (inputValue) =>
    api.UserApi.findByString(false, {
      searchString: inputValue
    })
      .then((payload) => {
        return payload.map((user) => ({
          label: user.username,
          value: user
        }));
      })

  onChange = (valueLabel) => {
    this.props.onSelect(valueLabel.value);
  }

  renderLi = ({ value, label, customAbbreviation }) =>
    <div className={css.li}>
      <img src={value.avatarUrl} alt="Avatar of a current user"/>
      <div className="right">
        <div className="name">{value.username}</div>
        <div className="email">{value.email}</div>
      </div>
    </div>

  render = () =>
    <AsyncSelect
      cacheOptions
      defaultOptions

      loadOptions={this.loadOptions}
      value={null}
      onChange={this.onChange}

      formatOptionLabel={this.renderLi}
      // menuIsOpen

      className="react-select-container"
      classNamePrefix="react-select"
      theme={(theme) => ({
        ...theme,
        borderRadius: 2,
        colors: {
          ...theme.colors,
          primary: 'rgb(222, 235, 255)',
          primary75: 'rgb(222, 235, 255)',
          primary50: 'rgb(222, 235, 255)',
          neutral0:  'white',
          neutral5:  'rgb(204, 204, 204)',
          neutral10: 'rgb(204, 204, 204)',
          neutral20: 'rgb(204, 204, 204)',
          neutral30: 'rgb(204, 204, 204)',
          neutral40: 'rgb(204, 204, 204)',
          neutral50: 'rgb(204, 204, 204)',
          neutral60: 'rgb(204, 204, 204)',
          neutral70: 'rgb(204, 204, 204)',
          // text
          neutral80: 'rgb(128, 128, 128)',
          neutral90: 'rgb(204, 204, 204)'
        },
      })}
    />
}

export default UserSelect;
