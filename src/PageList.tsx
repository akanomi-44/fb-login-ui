import React, { useState, useEffect } from "react";

const PageList = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    // Make a request to the Graph API to get the user's pages
    fetch("https://graph.facebook.com/v16.0/me/accounts?access_token=<USER_ACCESS_TOKEN>")
      .then((response) => response.json())
      .then((data) => {
        setPages(data.data);
        console.log(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Pages</h2>
      <ul>
        {pages.map((page: any) => (
          <li key={page.id}>
            <a
              href={`https://www.facebook.com/${page.id}`}
              target="_blank"
              rel="noopener noreferrer">
              {page.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageList;
