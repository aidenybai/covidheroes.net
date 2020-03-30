const matchHtmlRegExp = /["'&<>]/;
let count = 0;

window.onload = () => {
  const base = `${window.location.origin}/v1/`;
  if (localStorage.getItem('name')) {
    async function postData(url = '', data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      try {
        return await response.json(); // parses JSON response into native JavaScript objects
      } catch (err) {
        alert('Invalid Offer');
      }
    }

    async function addEntry(user, id, rep, dom, staff) {
      let origUser = user;
      if (localStorage.getItem('id') === id)
        user = `${user} <span class="badge badge-outline-primary" style="background: #6C63FF !important; color: #fff !important">YOU</span>`;
      if (staff) user = `${user} <span class="badge badge-outline-primary">STAFF</span>`;
      document.querySelector(dom).innerHTML += `<tr id="${id}">
        <th scope="row"><a href="${window.location.origin}/@${origUser}" style="color: #6C63FF !important">${user}</a></th>
        <td>${id}</td>
        <td><b><i class="fas fa-sort-up"></i>${rep}</b></td>
      </tr>`;
    }

    fetch(`${base}users`)
      .then((res) => res.json())
      .then((body) => {
        count = body.users.length + 1;
        let users = body.users;
        let totals = [];
        users.forEach(async (user) => {
          try {
            const { rep, staff } = await fetch(`${base}userdata?id=${user[1]}`).then((res) =>
              res.json()
            );
            totals.push([user[0], user[1], String(rep.length), staff || false]);
            if (users.length === totals.length) {
              document.getElementById('table').innerHTML = '';
              totals
                .sort((a, b) => {
                  return !a[0].localeCompare(b[0]);
                })
                .sort((a, b) => {
                  return a[2] - b[2];
                })
                .reverse()
                .slice(0, 10)
                .forEach((user) => {
                  addEntry(
                    esc(DOMPurify.sanitize(user[0])),
                    esc(DOMPurify.sanitize(user[1])),
                    esc(DOMPurify.sanitize(user[2])),
                    '#table',
                    user[3]
                  );
                });
            }
          } catch (err) {
            return;
          }
        });
      });
  } else {
    window.location = `${window.location.origin}/login`;
  }
};

function esc(string) {
  const str = `${string}`;
  const match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  let escape;
  let html = '';
  let index = 0;
  let lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

function enable() {
  document.querySelector('#submit').disabled = false;
}