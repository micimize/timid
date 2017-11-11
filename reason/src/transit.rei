type format;

type reader;

let reader: (~format: format=?, 'options) => reader;

type writer;

[@bs.send] external read : (reader, 'a) => 'b = "read";

type writehandler;

[@bs.val] [@bs.module "transit-js"] external makeWriteHandler : 'a => writehandler =
  "makeWriteHandler";

type transitMap;

[@bs.val] [@bs.module "transit-js"] external map : 'handlers => transitMap = "map";

let writer: (~format: format=?, transitMap) => writer;

[@bs.send] external write : (writer, 'a) => 'b = "write";
