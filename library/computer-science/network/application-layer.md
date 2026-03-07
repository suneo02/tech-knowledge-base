# 应用层核心概念解析

本文档旨在系统性地梳理应用层的核心知识点，特别是针对面试中常见的问题，提供清晰、有条理的解答。

---

## 一、HTTP 协议基础

HTTP (HyperText Transfer Protocol，超文本传输协议) 是互联网上应用最广泛的一种网络协议，用于客户端和服务器之间的通信。

### 1.1 URI 与 URL

- **URI (Uniform Resource Identifier, 统一资源标识符)**：用于唯一标识互联网上的资源。它是一个字符串标准，是 URL 和 URN 的超集。
- **URL (Uniform Resource Locator, 统一资源定位符)**：是 URI 最常见的形式，我们通常称之为“网址”。它不仅标识了资源，还提供了找到该资源的方式（即协议和位置）。
- **URN (Uniform Resource Name, 统一资源名称)**：也是 URI 的一种，通过名称来标识资源，而不关心其具体位置。

一个完整的 URL 通常包含以下部分：
`协议://域名:端口/路径?查询参数#片段ID`

1.  **协议 (Protocol)**：如 `http`, `https`。
2.  **域名 (Domain)**：如 `www.example.com`。
3.  **端口 (Port)**：HTTP 默认 80，HTTPS 默认 443。
4.  **路径 (Path)**：资源在服务器上的位置，如 `/products/index.html`。
5.  **查询参数 (Query Parameters)**：向服务器传递的额外信息，如 `?id=123&type=A`。
6.  **片段ID (Fragment)**：指向页面内部的锚点，如 `#section1`。

### 1.4 HTTP 状态码

- **1xx (信息性)**：请求已接收，继续处理。
- **2xx (成功)**
  - `200 OK`: 请求成功。
  - `201 Created`: 请求成功，并且服务器创建了新的资源。
  - `204 No Content`: 服务器成功处理了请求，但没有返回任何内容。
- **3xx (重定向)**
  - `301 Moved Permanently`: 永久重定向。
  - `302 Found`: 临时重定向。
  - `304 Not Modified`: 资源未被修改，客户端可以使用缓存的版本。
- **4xx (客户端错误)**
  - `400 Bad Request`: 服务器不理解请求的语法。
  - `401 Unauthorized`: 请求要求身份验证。
  - `403 Forbidden`: 服务器拒绝请求。
  - `404 Not Found`: 服务器找不到请求的资源。
- **5xx (服务器错误)**
  - `500 Internal Server Error`: 服务器内部错误。
  - `502 Bad Gateway`: 作为网关或代理的服务器，从上游服务器收到无效响应。
  - `503 Service Unavailable`: 服务器暂时无法处理请求（超载或维护）。

### 1.5 HTTP 报文结构

#### 常用请求头 (Request Headers)

- `Host`: 指定服务器的域名和端口号。
- `User-Agent`: 客户端的浏览器和操作系统信息。
- `Accept`: 客户端能接收的内容类型。
- `Accept-Encoding`: 客户端能接收的编码方式（如 gzip）。
- `Accept-Language`: 客户端能接收的语言。
- `Connection`: 连接管理，如 `keep-alive`。
- `Cookie`: 客户端存储的 Cookie 信息。
- `Referer`: 请求的来源页面。
- `Cache-Control`: 缓存控制。
- `If-Modified-Since`: 用于协商缓存，值为上次服务器返回的 `Last-Modified`。
- `If-None-Match`: 用于协商缓存，值为上次服务器返回的 `ETag`。

#### 常用响应头 (Response Headers)

- `Content-Type`: 响应资源的媒体类型和字符编码。
- `Content-Length`: 响应体的长度。
- `Content-Encoding`: 响应资源的压缩编码。
- `Server`: 服务器软件信息。
- `Date`: 响应产生的日期和时间。
- `Connection`: 连接管理。
- `Cache-Control`: 缓存控制策略。
- `Expires`: 缓存过期时间。
- `Last-Modified`: 资源的最后修改时间。
- `ETag`: 资源的唯一标识。
- `Access-Control-Allow-Origin`: 用于 CORS，指定允许跨域请求的源。
