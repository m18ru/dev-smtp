[![NPM][npm]][npm-url]
[![Dependencies][deps]][deps-url]
[![DevDependencies][deps-dev]][deps-dev-url]

# dev-smtp

A development SMTP server with storing mails as files.

## Installation

```
npm install --save-dev dev-smtp
```

Or globally:

```
npm install -g dev-smtp
```

## Usage

```
dev-smtp [options] <path>
```

`<path>` - Path to directory to store emails (should exist).

### Options

- -p, --port PORT — Port to listen for (default is `2525`).
- -v, --version — Current version.

## Example

Run SMTP server on port `2525` and store emails in the `./mail` directory:
```
dev-smtp mail
```

Run SMTP server on port `25` and store emails in `/tmp`:
```
dev-smtp --port 25 /tmp
```

## Directory stucture

Recieved emails are parsed and their content saved in directory:
```
year-month-date-hours-minutes-seconds-milliseconds-counter-subject
```

Where:

- Date parts is a date of email, or current date if email has no date.
- Counter is increased when server get two emails with the same date in a row.
- Subject is a `subject` header of email.

Directory contains this files:

- `raw.eml` — is a raw email data.
- `headers.txt` — is a parsed (decoded) headers of the email.
- `message.txt` — is a plain text email body (if exists).
- `message.html` — is an HTML email body (if exists).
- `attachment_*` — is an attachments of the email.

## API

To use in JS/TS code:

```js
import devSmtp from 'dev-smtp';

devSmtp( '/tmp', 2525 );
```

Interface of the function:

```ts
/**
 * Run development SMTP server.
 * 
 * @param mailRootDir Path to directory to store emails.
 * @param port TCP port number.
 */
function main( mailRootDir: string, port: number = 25 ): SMTPServer;
```

Where `SMTPServer` is a server object from `smtp-server` package.

## License

[MIT](LICENSE).

[npm]: https://img.shields.io/npm/v/dev-smtp.svg
[npm-url]: https://npmjs.com/package/dev-smtp

[deps]: https://img.shields.io/david/m18ru/dev-smtp.svg
[deps-url]: https://david-dm.org/m18ru/dev-smtp

[deps-dev]: https://img.shields.io/david/dev/m18ru/dev-smtp.svg
[deps-dev-url]: https://david-dm.org/m18ru/dev-smtp?type=dev
