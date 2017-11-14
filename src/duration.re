type incrementalParser('a) =
  | Raw(string)
  | Partial(string, 'a)
  | Completed('a);

type t = {
  precision: Precision.precision,
  duration: MomentRe.Duration.t
};

module Parse = {
  let optional = (regex: string) => {j|(?:$regex)?|j};
  let designator = (prefix: string, units: list(string)) =>
    prefix ++ String.concat("", List.map((suffix: string) => optional({j|([0-9,.]+)$suffix|j}), units));

  let period = designator({|(\-|\+)?P|}, ["Y", "M", "D"]);
  let time = optional(designator("T", ["H", "M", "S"]));
  let pattern = Js.Re.fromString(period ++ time);

  let process = (value: string, arr: array(string)) => {
    let [ match, s, ...values ] = Array.to_list(arr);
    let precision = switch(values) {
    | [ years, months, days, hours, minutes, seconds ] when Js.String.contains(seconds, ".") => Precision.Millisecond
    | [ years, months, days, hours, minutes, seconds ] when seconds  => Precision.Second
    | [ years, months, days, hours, minutes ] => Precision.Seconds
    }
    (Js.String.replace(match, ""), { years, months, days, hours, minutes, seconds });
  };
  let parse = (value) =>
    switch (Js.String.match(pattern, value)) {
    |  Some(array) => process(value, array)
    |  _ => value
    }
};

let make = MomentRe.duration;

let writerSpec =
  Transit.makeWriteHandler([@bs] {
    pub tag = () => "duration";
    pub rep = (duration, ()) => toJSON(duration);
  });
let readerSpec = json => MomentRe.duration(json);
};

let writer =
Transit.writer @@
/*
  In javascript this is a transit map from function constructors as keys to
  writehandlers as values. Function constructors as keys only
  matter if you have something like:
  var Point = function(x, y) { this.x = x; this.y = y; };
  (I think, need to investigate more)
  */
Transit.map((
  "Duration", Duration.writerSpec,
));


let write = v => Transit.write(writer, v);
let read = v => Transit.read(reader, v);

let encodedDuration = write(Duration.make(1, `days));

let decodedDuration = read(encodedDuration);


