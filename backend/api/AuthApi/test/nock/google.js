import nock from 'nock';

nock('https://www.googleapis.com')
  .post('/oauth2/v4/token')
  .reply(200, {
    access_token: "ya29.Glv2BJdQe3THv92HpB5_172HloxK-9u89TertdTvCQ-EsO-C42zmhz5sznWL4HEQZGkumw17cvaONskQv9UcFYIjaprLqIH3yhdRm7RIPzAY35IU_5XAlIhFSZof",
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: "1/JShuWJlaQ51vf-HItsb9X7Q8g4CruUmhexm2t8D6BjU",
    id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRkMGYzZTQyMjUwOGY4YWQxYjYxYjQ2ZGQ2M2UyNmNjYmUxNjMzOTEifQ.eyJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDgzNzk3OTAyNjEzODE1MjcyMjMiLCJlbWFpbCI6Imtwcm9zdHlha292QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiTGxZQmY5d19FdlY2MTdTX2lScVB5QSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwOTUyNDg0OCwiZXhwIjoxNTA5NTI4NDQ4LCJuYW1lIjoiS2lyaWxsIFByb3N0eWFrb3YiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDUuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy0tMnNOcmVzcWxtdy9BQUFBQUFBQUFBSS9BQUFBQUFBQUE1TS95MWJDXzRzSVN6Zy9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiS2lyaWxsIiwiZmFtaWx5X25hbWUiOiJQcm9zdHlha292IiwibG9jYWxlIjoicnUifQ.gdBOSekyoB4c4AO3Vf7B8uVOzaLhZp6Qa1fDhfAGP1dPAszJPMf2RaKx8aJxL6GofrGDmh2ZOODRkL_r8W7qE6fVrtiA_GD1FqIMIkS6X1BsFkBeSlHDU7N6cnRhqav3aQ1sEU8hqpa8MFBhPoMqd9SxfkXxgVZHZ0UIqLe4yweOI2jW5Ir5Lmp9NXV2BckLrSPz039pIAwrRHOPeaYW6aEtwvfDHNaNqo0PPp6R7TALK_InBY1PSoAG-gA50kh1zTPxH-T2o6af2nWlIBaYGqV8-s9Yoeep1-QzD9Gul-LrGaI8UIs7i1xp6en_qnAl2F4P80Qov7_eCCL5AJNtDw"
  });

nock('https://www.googleapis.com')
  .get('/userinfo/v2/me')
  .reply(200, {
    family_name: "Prosvvrakv",
    name: "Kjrjll Prosvvrakv",
    picture: "https://lh5.googleusercontent.com/--2sNresqlmw/AAAAAAAAAAI/AAAAAAAAA5M/y1bC_4sISzg/photo.jpg",
    locale: "ru",
    gender: "female",
    email: "kprosvvrakv@gmail.com",
    link: "https://plus.google.com/108379790261381527443",
    given_name: "Kjrjll",
    id: "108379790261381527443",
    verified_email: true
  });
