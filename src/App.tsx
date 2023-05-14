import React, { useCallback, useEffect, useState } from "react";
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

interface Webhook {
  page_id: string;
  webhook?: string;
}

const URL = "https://api.myecomer.me/";

const WebhookInput = ({
  access_token,
  page_id,
  webhook,
}: {
  access_token: string;
  webhook?: string;
  page_id: string;
}) => {
  const [text, setText] = useState<string>();
  const handleUpdateText = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.value) {
      setText(event.target.value);
    }
  }, []);

  const handleUpdateWebhook = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      if (!text) {
        return;
      }

      const payload = {
        page_webhook_url: text,
        page_id: page_id,
      };

      try {
        await fetch(URL + "set_webhook_url", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    [page_id, text],
  );

  return (
    <>
      <TextField
        id="filled-basic"
        label="Webhook"
        value={text}
        defaultValue={webhook}
        variant="filled"
        onChange={handleUpdateText}
        style={{ color: "white!" }}
      />
      <Button onClick={handleUpdateWebhook}>Save</Button>
    </>
  );
};

const App = () => {
  const [user, setUser] = useState<User>();
  const [pages, setPages] = useState<PageData[]>([]);
  const [error, setError] = useState<any>(null);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);

  const handleLoginSuccess = (response: AccountResponse) => {
    console.log({ response });

    setUser({ email: response.email, id: response.id, name: response.name });
    setPages(response.accounts.data);
  };

  const handleLoginFailure = (response: any) => {
    setError(response);
  };

  const HandleInstall = useCallback(
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

        await fetch(URL + "add_page_info", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        alert(error.message);
      }
    },
    [user],
  );

  const RenderWebhook = useCallback(
    (pageId: string, access_token: string) => {
      const webhook = webhooks.filter((webhook) => webhook.page_id === pageId);
      if (!webhook.length) {
        return (
          <Button
            variant="outlined"
            key={pageId}
            onClick={(e) => HandleInstall(e, pageId, access_token)}>
            Install Bot
          </Button>
        );
      }

      return (
        <WebhookInput webhook={webhook[0].webhook} access_token={access_token} page_id={pageId} />
      );
    },
    [HandleInstall, webhooks],
  );
  const getWebhooks = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`https://api.myecomer.me/getWebhooks?userId=${userId}`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.

        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await response.json(); //
      console.log(data);
      setWebhooks(data.pages);
    } catch (error: any) {
      alert(error.message);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getWebhooks(user.id);
    }
  }, [getWebhooks, user]);

  return (
    <div className="App">
      {user && pages ? (
        <TableContainer
          style={{
            height: "50vh",
            width: "50vw",
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "25%",
            paddingTop: "10%",
          }}>
          <Table>
            <TableHead>
              <TableCell>Name</TableCell>
              <TableCell>WebHook</TableCell>
            </TableHead>
            <TableBody>
              {pages.map((page: any) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <a
                      href={`https://www.facebook.com/${page.id}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      {page.name}
                    </a>
                  </TableCell>
                  <TableCell>{RenderWebhook(page.id, page.access_token)}</TableCell>
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
          <FacebookButton onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />
        </header>
      ) : (
        <></>
      )}
      {error ? <p>{error.message}</p> : <></>}
    </div>
  );
};

export default App;
