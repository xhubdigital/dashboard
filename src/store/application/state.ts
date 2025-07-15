import moment from 'moment';

export interface ApplicationState {
  now: moment.Moment;
}

function state(): ApplicationState {
  return {
    now: moment(),
  };
}

export default state;
