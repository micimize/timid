type reader;

type format =
  | Json
  | JsonVerbose;

let string_of_format = (t) =>
  switch t {
  | Json => "json"
  | JsonVerbose => "json-verbose"
  };

[@bs.val] [@bs.module "transit-js"] external raw_reader : (string, 'options) => reader = "reader";

let reader = (~format=Json, options) => {
  let readerType = string_of_format(format);
  raw_reader(readerType, options)
};

[@bs.send] external read : (reader, 'a) => 'b = "read";

type writehandler;

[@bs.val] [@bs.module "transit-js"] external makeWriteHandler : 'a => writehandler =
  "makeWriteHandler";

type writer;

type transitMap;

[@bs.val] [@bs.module "transit-js"] external map : 'handlers => transitMap = "map";

[@bs.val] [@bs.module "transit-js"] external raw_writer : (string, 'handler) => writer = "writer";

let writer = (~format=Json, options) => {
  let writerType = string_of_format(format);
  raw_writer(writerType, {"handlers": options})
};

[@bs.send] external write : (writer, 'a) => 'b = "write";
