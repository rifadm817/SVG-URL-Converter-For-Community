# SVG URL Converter

## Overview

The **SVG URL Converter** is a streamlined solution for managing and deploying SVG files with dynamic capabilities. It allows you to embed variables directly within your SVGs, enabling real-time customization through URL query parameters. This makes your graphics more versatile and interactive.

## Features

- **Dynamic Tag Replacement:** Embed placeholders in your SVGs that are replaced with real-time data via URL parameters.
- **Express.js Integration:** Simple and efficient server setup using Express.js.
- **Scalable Deployment:** Optimized for deployment on Google Cloud App Engine.
- **CORS Enabled:** Supports cross-origin requests for broader integration.

## Project Structure

```
SVG URL Converter/
├── SVG URL Converter/
│   ├── app.yaml
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── svgs/
│       └── Business-Settings/
│           └── setting.svg
├── svgAutoUrlCommenter/
│   ├── svgAutoUrlCommenter.js
│   └── watcher.js
├── .gitignore
├── README.md
└── Commands.txt
```

- **SVG URL Converter/**
  - **app.yaml:** Configuration file for deploying to Google Cloud App Engine.
  - **package.json & package-lock.json:** Lists project dependencies and scripts.
  - **server.js:** Core Express server handling SVG requests and dynamic tag replacements.
  - **svgs/**: Directory containing SVG files organized into categories.
    - **Business-Settings/setting.svg:** Sample SVG with dynamic tags.
  
- **svgAutoUrlCommenter/**
  - **svgAutoUrlCommenter.js & watcher.js:** Scripts to automate URL commenting in SVG files.

- **.gitignore:** Specifies files and directories to be ignored by Git.
- **README.md:** Documentation for the project.
- **Commands.txt:** Additional commands or scripts (optional).

## Getting Started

Follow these steps to set up and run the SVG URL Converter:

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/rifadm817/SVG-URL-Converter-For-Community.git
cd SVG-URL-Converter-For-Community
```

### 2. Install Dependencies

Ensure you have [Node.js](https://nodejs.org/) (version 20) installed. Then, install the necessary packages:

```bash
cd "SVG URL Converter"
npm install
```

**Key Dependencies:**
- **express:** Web framework for Node.js.
- **cors:** Middleware to enable CORS.

These dependencies are listed in the `package.json` and will be installed automatically with `npm install`.

### 3. Configure the Server

Open `server.js` and review the configuration:

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/svg/*', (req, res) => {
    let svgRelativePath = req.params[0];

    if (svgRelativePath.endsWith('.svg')) {
        svgRelativePath = svgRelativePath.slice(0, -4);
    }

    const svgPath = path.join(__dirname, 'svgs', svgRelativePath + '.svg');

    fs.readFile(svgPath, 'utf8', (err, svgData) => {
        if (err) {
            return res.status(404).send('SVG file not found');
        }

        let modifiedSvg = Object.entries(req.query).reduce((data, [key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            return data.replace(regex, value);
        }, svgData);

        res.set('Cache-Control', 'private, max-age=10000000');
        res.type('image/svg+xml');
        res.send(modifiedSvg);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

**Key Points:**
- **Endpoint:** Access SVGs via `http://your-server-url/svg/path/to/your.svg`.
- **Dynamic Tags:** Use `{{tag}}` within SVG files. These placeholders are replaced by query parameters in the URL.

### 4. Prepare SVGs with Dynamic Tags

Embed placeholders in your SVG files where dynamic content is required. Example:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  <text x="10" y="50">{{message}}</text>
</svg>
```

### 5. Run the Server Locally

Start the server to test locally:

```bash
node server.js
```

Access the SVG in your browser:

```
http://localhost:3000/svg/Business-Settings/setting?message=HelloWorld
```

The SVG will display "HelloWorld" in place of `{{message}}`.

## Deployment on Google Cloud App Engine

Deploying the SVG URL Converter on Google Cloud ensures scalability and reliability.

### 1. Set Up Google Cloud Project

- **Create a Project:** In the [Google Cloud Console](https://console.cloud.google.com/).
- **Install Google Cloud SDK:** Follow the [installation guide](https://cloud.google.com/sdk/docs/install).
- **Authenticate:** Run `gcloud init` to authenticate and set your project.

### 2. Configure `app.yaml`

Ensure your `app.yaml` is set up for Node.js:

```yaml
runtime: nodejs20

handlers:
  - url: /static
    static_dir: static
    http_headers:
      Access-Control-Allow-Origin: "*"
      Access-Control-Allow-Methods: "GET"
      Access-Control-Allow-Headers: "Content-Type"
    secure: always

  - url: /.*
    script: auto

automatic_scaling:
  min_idle_instances: 1
  max_idle_instances: automatic
  min_pending_latency: automatic
  max_pending_latency: automatic

env_variables:
  NODE_ENV: 'production'
```

**Highlights:**
- **Runtime:** Node.js version 20.
- **Handlers:**
  - **/static:** Serves static files with CORS headers.
  - **All other URLs:** Managed by the Express server.
- **Automatic Scaling:** Optimizes performance and resource management.
- **Environment Variables:** Sets `NODE_ENV` to production.

### 3. Deploy to App Engine

From the project root directory (`SVG URL Converter`), deploy your application:

```bash
gcloud app deploy
```

Once deployed, your server will be accessible at `https://your-project-id.appspot.com`.

## Usage

### Example

Given an SVG at `svgs/Business-Settings/setting.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <text x="10" y="50">Welcome, {{username}}!</text>
</svg>
```

**Access the Dynamic SVG:**

```
https://your-project-id.appspot.com/svg/Business-Settings/setting?username=JohnDoe
```

**Result:**

The SVG displays "Welcome, JohnDoe!" replacing `{{username}}`.

## Best Practices

- **Organize SVGs:** Maintain a structured `svgs` directory for easy management.
- **Consistent Tagging:** Use clear placeholder names to ensure predictable replacements.
- **Caching:** Utilize caching headers to enhance performance for frequently accessed SVGs.
- **Security:** Sanitize input from query parameters to prevent injection attacks.

## Security Considerations

- **Input Validation:** Ensure that any data received via query parameters is properly sanitized to prevent injection attacks.
- **Access Control:** Implement authentication if your SVGs contain sensitive information.
- **CORS Configuration:** Adjust CORS settings in `app.yaml` and your server to allow only trusted origins if necessary.

## Contributing

Contributions are welcome to enhance the SVG URL Converter. Whether improving the code, adding features, or refining documentation, your input is valuable.
