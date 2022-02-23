interface HttpOption {
  method: string;
  headers?: any;
  body?: any;
}

const http = <T>(url: string, options: HttpOption | {} = {}) => {
  return fetch(url, options).then((response) => {
    if (response.ok) return response.json();
    else throw Error(response.status.toString());
  }) as Promise<T>;
};

export default http;
