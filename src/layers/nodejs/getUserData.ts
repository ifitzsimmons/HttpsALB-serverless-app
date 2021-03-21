/* eslint-disable camelcase */
import axios from 'axios';
import base64url from 'base64url';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

type GoogleUserData = {
  /** ID Token */
  sub: string;

  /** full name for google account */
  name: string;

  /** First name */
  given_name: string;

  /** Last Name */
  family_name: string;

  /** Link to google profile picture */
  picture: string;

  /** Token Issuer */
  iss: 'https://accounts.google.com';

  email: string;
  email_verified: string;
};

export const getUserData = async (token: string): Promise<GoogleUserData> => {
  // IMPORTANT
  // https://github.com/auth0/node-jws/pull/84
  // https://github.com/auth0/node-jsonwebtoken/issues/514#issuecomment-461100470
  const base64urlToken = base64url.fromBase64(token);

  const jwtHeader = token.split('.')[0];
  const decodedHeader = Buffer.from(jwtHeader, 'base64').toString('utf-8');

  const decodedJwt = JSON.parse(decodedHeader);
  const keyId = decodedJwt.kid;

  const url = `https://public-keys.auth.elb.us-east-1.amazonaws.com/${keyId}`;
  const response = await axios.get(url);
  const key = response.data;

  const payload: GoogleUserData = jwt.decode(base64urlToken, key, {
    algorithm: 'ES256',
    base64: true,
  });

  console.log('USER DATA:');
  console.log(JSON.stringify(payload));
  return payload;
};
