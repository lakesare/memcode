/* eslint-disable */
"use strict";

const pgp = require('pg-promise');
const pgPackage = pgp({});

import * as Course from '~/components/courses/model';
import * as User from '~/components/users/model';

// ____Enzyme
// shallow Shallow rendering is useful to constrain yourself to testing a component as a unit, and to ensure that your tests aren't indirectly asserting on behavior of child components.

// mount Full DOM rendering is ideal for use cases where you have components that may interact with DOM APIs, or may require the full lifecycle in order to fully test the component (i.e., componentDidMount etc.)

// Enzyme's render function is used to render react components to static HTML and analyze the resulting HTML structure.
