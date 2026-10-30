"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  email: string;
  name?: string;
  sub: string;
  [key: string]: any;
}

interface CognitoTokens {
  IdToken: string;
  AccessToken: string;
  RefreshToken?: string;
  ExpiresIn: number;
}

interface AuthContextType {
  user: User | null;
  idToken: string | null;
  accessToken: string | null;
  refreshTokenVal: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUpUser: (email: string, password: string) => Promise<void>;
  verifySignUp: (email: string, code: string) => Promise<void>;
  requestForgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
  triggerTokenRefresh: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REGION = process.env.NEXT_PUBLIC_REGION || "us-east-1";
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || "";
const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || "";
const COGNITO_URL = `https://cognito-idp.${REGION}.amazonaws.com/`;

async function cognitoRequest(target: string, body: any): Promise<any> {
  const response = await fetch(COGNITO_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": `AWSCognitoIdentityProviderService.${target}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Cognito operation failed: ${target}`);
  }
  return data;
}

function parseJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenVal, setRefreshTokenVal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set tokens in memory and storage helper
  const saveSession = useCallback((tokens: CognitoTokens) => {
    localStorage.setItem("nextrole_id_token", tokens.IdToken);
    localStorage.setItem("nextrole_access_token", tokens.AccessToken);
    if (tokens.RefreshToken) {
      localStorage.setItem("nextrole_refresh_token", tokens.RefreshToken);
      setRefreshTokenVal(tokens.RefreshToken);
    }

    setIdToken(tokens.IdToken);
    setAccessToken(tokens.AccessToken);

    const decoded = parseJwt(tokens.IdToken);
    if (decoded) {
      setUser({
        email: decoded.email,
        name: decoded.name || decoded.given_name || decoded.email.split("@")[0],
        sub: decoded.sub,
        ...decoded
      });
    }
  }, []);

  // Token Refresh function
  const triggerTokenRefresh = useCallback(async (): Promise<string | null> => {
    const storedRefreshToken = localStorage.getItem("nextrole_refresh_token") || refreshTokenVal;
    if (!storedRefreshToken) {
      logout();
      return null;
    }

    try {
      const data = await cognitoRequest("InitiateAuth", {
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: {
          REFRESH_TOKEN: storedRefreshToken
        }
      });

      const res = data.AuthenticationResult;
      const updatedTokens: CognitoTokens = {
        IdToken: res.IdToken,
        AccessToken: res.AccessToken,
        ExpiresIn: res.ExpiresIn
      };

      saveSession(updatedTokens);
      return res.IdToken;
    } catch (error) {
      console.error("Cognito Token Refresh Failed:", error);
      logout();
      return null;
    }
  }, [refreshTokenVal, saveSession]);

  // Session persistence validation on mount
  useEffect(() => {
    async function initAuth() {
      const storedIdToken = localStorage.getItem("nextrole_id_token");
      const storedAccessToken = localStorage.getItem("nextrole_access_token");
      const storedRefreshToken = localStorage.getItem("nextrole_refresh_token");

      if (storedIdToken && storedAccessToken) {
        const decoded = parseJwt(storedIdToken);
        if (decoded) {
          const isExpired = decoded.exp * 1000 < Date.now();
          if (!isExpired) {
            setIdToken(storedIdToken);
            setAccessToken(storedAccessToken);
            if (storedRefreshToken) setRefreshTokenVal(storedRefreshToken);

            setUser({
              email: decoded.email,
              name: decoded.name || decoded.given_name || decoded.email.split("@")[0],
              sub: decoded.sub,
              ...decoded
            });
          } else if (storedRefreshToken) {
            // Token expired, attempt refresh
            await triggerTokenRefresh();
          } else {
            // Expired and no refresh token
            localStorage.clear();
          }
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, [triggerTokenRefresh]);

  const login = async (email: string, password: string) => {
    const data = await cognitoRequest("InitiateAuth", {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });

    const res = data.AuthenticationResult;
    saveSession({
      IdToken: res.IdToken,
      AccessToken: res.AccessToken,
      RefreshToken: res.RefreshToken,
      ExpiresIn: res.ExpiresIn
    });
  };

  const signUpUser = async (email: string, password: string) => {
    await cognitoRequest("SignUp", {
      ClientId: CLIENT_ID,
      Username: email.split("@")[0],   // username = mohitn0305
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email
        }
      ]
    });
  };
  const verifySignUp = async (email: string, code: string) => {
    await cognitoRequest("ConfirmSignUp", {
      ClientId: CLIENT_ID,
      Username: email.split("@")[0],
      ConfirmationCode: code.trim()
    });
  };

  const requestForgotPassword = async (email: string) => {
    await cognitoRequest("ForgotPassword", {
      ClientId: CLIENT_ID,
      Username: email
    });
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    await cognitoRequest("ConfirmForgotPassword", {
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword
    });
  };

  const loginWithGoogle = () => {
    if (!COGNITO_DOMAIN || !CLIENT_ID || !REDIRECT_URI) {
      console.error("Cognito parameters missing in environment variables.");
      alert("Google Login is not configured. Verify COGNITO_DOMAIN and CLIENT_ID.");
      return;
    }
    // Direct Google authentication redirect URL through Cognito Hosted UI
    const authUrl = `https://${COGNITO_DOMAIN}/oauth2/authorize?identity_provider=Google&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=token&client_id=${CLIENT_ID}&scope=email+openid+profile`;

    window.location.href = authUrl;
  };

  const logout = () => {
    localStorage.removeItem("nextrole_id_token");
    localStorage.removeItem("nextrole_access_token");
    localStorage.removeItem("nextrole_refresh_token");

    setIdToken(null);
    setAccessToken(null);
    setRefreshTokenVal(null);
    setUser(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value= {{
    user,
      idToken,
      accessToken,
      refreshTokenVal,
      isAuthenticated: !!idToken,
        isLoading,
        login,
        signUpUser,
        verifySignUp,
        requestForgotPassword,
        resetPassword,
        loginWithGoogle,
        logout,
        triggerTokenRefresh
  }
}
    >
  { children }
  </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
