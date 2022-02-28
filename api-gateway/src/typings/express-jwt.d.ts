interface Claims {
  accountId: string;
  teamId: string;
  teamRole: "LEADER" | "MEMBER";
}

declare namespace Express {
  interface Token {
    iss: string;
    sub: string;
    aud: string | string[];
    iat: number;
    exp: number;
    azp: string;
    scope: string;
    "https://techradar.ch/claims/uuid": string;
    verifiedClaims: Claims;
  }

  interface Request {
    user?: Token;
  }
}
