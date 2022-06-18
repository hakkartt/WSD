import * as base64 from "https://deno.land/x/base64@v0.2.1/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import * as fileService from "../../services/fileService.js";

const viewForm = async ({ render }) => {
  const lastId = await fileService.lastUploadedId();
  render("index.eta", {
    last_id: lastId,
  });
};

const processUpload = async ({ request, response }) => {
  const body = request.body({type: "form-data"});
  const reader = await body.value;
  const data = await reader.read();

  const fileDetails = data.files[0];

  // reading and encoding
  const fileContents = await Deno.readAll(await Deno.open(fileDetails.filename));
  const base64Encoded = base64.fromUint8Array(fileContents);

  response.body = await fileService.storeToDatabase(fileDetails, base64Encoded);
};

const retrieveFile = async ({ request, response }) => {

  const body = request.body({ type: "form" });
  const params = await body.value;
  const id = params.get("id");
  const password = params.get("password");

  const obj = await fileService.getFile(id);
  if (obj) {
    let pws_match = await bcrypt.compare(password, obj.password);
    if (pws_match) {
      response.headers.set('Content-Type', obj.type);
      const arr = base64.toUint8Array(obj.data);
      response.headers.set('Content-Length', arr.length);
      response.body = arr;
    } else {
      response.status = 401;
    }
  } else {
    response.status = 401;
  }
};
  

export { viewForm, processUpload, retrieveFile };
