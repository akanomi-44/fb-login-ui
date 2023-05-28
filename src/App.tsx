import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

import { AccountResponse, PageData, User } from "./schema";
import FacebookButton from "./FacebookButton";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Paper } from "@mui/material";

interface PageInfo {
  page_id: string;
  webhook?: string;
  location?: string;
  field?: string;
  shop_link?: string;
}

const URL = "https://api.myecomer.me/";

const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

const WebhookInput = ({
  webhook,
  onChange,
}: {
  webhook?: string;
  onChange: (newValue: string) => void;
}) => {
  const handleUpdateWebhook = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (event.target.value) {
        onChange(event.target.value);
      }
    },
    [onChange],
  );

  return (
    <>
      <TextField
        id="filled-basic"
        label="Webhook"
        value={webhook}
        defaultValue={webhook || "Enter HTTPS URL"}
        variant="filled"
        onChange={handleUpdateWebhook}
        style={{ color: "white!" }}
      />
    </>
  );
};
const LocationInput = ({
  location,
  onChange,
}: {
  location?: string;
  onChange: (newValue: string) => void;
}) => {
  const handleUpdateLocationText = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (event.target.value) {
        onChange(event.target.value);
      }
    },
    [onChange],
  );

  return (
    <>
      <TextField
        id="filled-basic"
        label="location"
        value={location}
        defaultValue={location || "Enter your shop location"}
        variant="filled"
        onChange={handleUpdateLocationText}
        style={{ color: "white!" }}
      />
    </>
  );
};
const ShopLinkInput = ({
  shop_link,
  onChange,
}: {
  shop_link?: string;
  onChange: (newValue: string) => void;
}) => {
  const handleUpdateShopLinkText = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (event.target.value) {
        onChange(event.target.value);
      }
    },
    [onChange],
  );

  return (
    <>
      <TextField
        id="filled-basic"
        label="shop_link"
        value={shop_link}
        defaultValue={shop_link || "Enter your Shop link"}
        variant="filled"
        onChange={handleUpdateShopLinkText}
        style={{ color: "white!" }}
      />
    </>
  );
};
const FieldInput = ({
  field,
  onChange,
}: {
  field?: string;
  onChange: (newValue: string) => void;
}) => {
  const handleUpdateFieldText = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (event.target.value) {
        onChange(event.target.value);
      }
    },
    [onChange],
  );

  return (
    <>
      <TextField
        id="filled-basic"
        label="field"
        value={field}
        defaultValue={field || "Enter your Shop's field"}
        variant="filled"
        onChange={handleUpdateFieldText}
        style={{ color: "white!" }}
      />
    </>
  );
};

const RenderPageInfo = ({
  pageId,
  access_token,
  pageInfos,
  handleUpdatePageInfo,
  handleInstall,
}: {
  pageId: string;
  access_token: string;
  pageInfos: PageInfo[];
  handleUpdatePageInfo: (
    e: any,
    page_id: string,
    webhookText?: string,
    locationText?: string,
    shopLink?: string,
    fieldText?: string,
  ) => void;
  handleInstall: (e: any, pageId: string, access_token: string) => void;
}) => {
  const [webhookText, setWebhookText] = useState<string | undefined>();
  const [locationText, setLocationText] = useState<string | undefined>();
  const [shopLink, setShopLink] = useState<string | undefined>();
  const [fieldText, setFieldText] = useState<string | undefined>();

  const pageInfo = useMemo(
    () => pageInfos?.filter((webhook) => webhook.page_id === pageId),
    [pageId, pageInfos],
  );

  return (
    <>
      <TableCell>
        <WebhookInput webhook={webhookText || pageInfo?.[0]?.webhook} onChange={setWebhookText} />
      </TableCell>
      <TableCell>
        <ShopLinkInput shop_link={shopLink || pageInfo?.[0]?.shop_link} onChange={setShopLink} />
      </TableCell>
      <TableCell>
        <FieldInput field={fieldText || pageInfo?.[0]?.field} onChange={setFieldText} />
      </TableCell>
      <TableCell>
        <LocationInput
          location={locationText || pageInfo?.[0]?.location}
          onChange={setLocationText}
        />
      </TableCell>

      <TableCell>
        <Button
          variant="outlined"
          key={pageId}
          disabled={!!pageInfo.length}
          onClick={(e) => handleInstall(e, pageId, access_token)}>
          Install Bot
        </Button>
      </TableCell>
      <TableCell>
        <Button
          variant="outlined"
          key={pageId}
          disabled={
            !(webhookText || pageInfo?.[0]?.webhook) &&
            !(locationText || pageInfo?.[0]?.location) &&
            !(shopLink || pageInfo?.[0]?.shop_link) &&
            !(fieldText || pageInfo?.[0]?.field)
          }
          onClick={(e) =>
            handleUpdatePageInfo(
              e,
              pageId,
              webhookText || pageInfo?.[0]?.webhook,
              locationText || pageInfo?.[0]?.location,
              shopLink || pageInfo?.[0]?.shop_link,
              fieldText || pageInfo?.[0]?.field,
            )
          }>
          Save
        </Button>
      </TableCell>
    </>
  );
};

const setAuthHeader = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const setJwt = async (accessToken: string) => {
  try {
    const response = await axios.post(`${URL}auth/facebook`, {
      access_token: accessToken,
    });
    const { token } = response.data;
    setAuthHeader(token);
  } catch (error) {
    console.error(error);
  }
};

const App = () => {
  const [user, setUser] = useState<User>();
  const [pages, setPages] = useState<PageData[]>([]);
  const [error, setError] = useState<any>(null);
  const [pageInfos, setPageInfos] = useState<PageInfo[]>([]);

  const getWebhooks = useCallback(async (userId: string) => {
    try {
      const response = await axios.get(`https://api.myecomer.me/getWebhooks?userId=${userId}`, {
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const { data } = response;

      setPageInfos(data.pages);
    } catch (error: any) {
      alert(error.message);
    }
  }, []);

  const handleLoginSuccess = useCallback(
    async (response: AccountResponse) => {
      await setJwt(response.accessToken);
      setUser({ email: response.email, id: response.id, name: response.name });
      setPages(response.accounts.data);
      await getWebhooks(response.id);
    },
    [getWebhooks],
  );

  const handleLoginFailure = (response: any) => {
    setError(response);
  };

  const handleInstall = useCallback(
    async (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      page_id: string,
      access_token: string,
    ) => {
      event.preventDefault();
      try {
        if (!user) {
          return;
        }
        const payload = {
          page_access_token: access_token,
          page_id: page_id,
          user_id: user.id,
        };

        await axios.post(URL + "add_page_info", {
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });

        getWebhooks(user.id);
      } catch (error: any) {
        alert(error.message);
      }
    },
    [getWebhooks, user],
  );

  const handleUpdatePageInfo = useCallback(
    async (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      page_id: string,
      webhookText?: string,
      locationText?: string,
      shopLink?: string,
      fieldText?: string,
    ) => {
      event.preventDefault();
      if (!webhookText || !locationText || !shopLink || !fieldText) {
        return;
      }

      const payload = {
        page_webhook_url: webhookText,
        page_id: page_id,
        location: locationText,
        field: fieldText,
        shop_link: shopLink,
      };

      try {
        const response = await axios.post(URL + "set_webhook_url", {
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { token } = response.data;
        alert("Đây là access token của server page " + token);
      } catch (error) {
        console.error(error);
      }
    },
    [],
  );

  useEffect(() => {
    if (user) {
      getWebhooks(user.id);
    }
  }, [getWebhooks, user]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {user && pages ? (
          <TableContainer
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
            component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>WebHook</TableCell>
                  <TableCell>Shop Link</TableCell>
                  <TableCell>Field</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Install ChatBot</TableCell>
                  <TableCell>Update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pages.map((page: PageData) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <a
                        href={`https://www.facebook.com/${page.id}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        {page.name}
                      </a>
                    </TableCell>
                    <RenderPageInfo
                      access_token={page.access_token}
                      handleInstall={handleInstall}
                      handleUpdatePageInfo={handleUpdatePageInfo}
                      pageId={page.id}
                      pageInfos={pageInfos}
                      key={page.id}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <></>
        )}
        {!user ? (
          <header className="App-header">
            <FacebookButton
              onLoginSuccess={handleLoginSuccess}
              onLoginFailure={handleLoginFailure}
            />
          </header>
        ) : (
          <></>
        )}
        {error ? <p>{error.message}</p> : <></>}
      </div>
    </ThemeProvider>
  );
};

export default App;
