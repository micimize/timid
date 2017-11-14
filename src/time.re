/* Instant
 * 2017-11-11T16:42:21.430Z-2017-11-12T16:42:21.430Z
 * 2017-11-11T16:42:21.430Z-2017-11-12T16:42:21.430Z
 */

/* empty time 
module Instant = {
  type t = unit;
  let make = () => ();
  let writerSpec =
    Transit.makeWriteHandler([@bs] {
      pub tag = () => "instant";
      pub rep = (()) => ();
    });
  let readerSpec = () => ();
};*/

module Duration = {

  type sign = Negative | Positive;
  type dur = {
    sign,
    years: float,
    months: float,
    days: float,
    hours: float,
    minutes: float,
    seconds: float
  };

  module Parse = {
    let optional = (regex: string) => {j|(?:$regex)?|j};
    let designator = (prefix: string, units: list(string)) =>
      prefix ++ String.concat("", List.map((suffix: string) => optional({j|([0-9,.]+)$suffix|j}), units));

    let period = designator({|(\-|\+)?P|}, ["Y", "M", "D"]);
    let time = optional(designator("T", ["H", "M", "S"]));
    let pattern = Js.Re.fromString("^" ++ period ++ time ++ "$");

    let field = (amount: string) =>
      amount
      |> Js.String.replace(",", ".")
      |> Js.Float.fromString;

    let process = (arr: array(string)) => {
      let [ s, ...amounts ] = Array.to_list(arr);
      let [ years, months, days, hours, minutes, seconds ] = List.map(field, amounts);
      let sign = switch s {
      | "-" => Negative 
      |  _  => Positive 
      };
      { sign,  years, months, days, hours, minutes, seconds };
    };
    let parse = (value) =>
    switch (Js.String.match(pattern, value)) {
    |  Some(array) => Some(process(array))
    |  _ => None
     }
  };


  include MomentRe.Duration;

  let make = MomentRe.duration;
  
  let writerSpec =
    Transit.makeWriteHandler([@bs] {
      pub tag = () => "duration";
      pub rep = (duration, ()) => toJSON(duration);
    });
  let readerSpec = json => MomentRe.duration(json);
};

module Precision = {
  type t =
    | Year
    | Month
    | Day
    | Hour
    | Minute
    | Second
    | Millisecond ; 

  let reader = (dateStr) => 
    switch (String.length(dateStr)) {
    |  4 => Year
    |  7 => Month
    | 10 => Day
    | 13 => Hour
    | 16 => Minute
    | 19 => Second
    | 23 => Millisecond
    };

  let truncate = (length, str) => String.sub(str, 0, length);

  let writer = (p) => 
    switch p {
    | Year => truncate(4)
    | Month => truncate(7)
    | Day => truncate(10)
    | Hour => truncate(13)
    | Minute => truncate(16)
    | Second => truncate(19)
    | Millisecond => truncate(23)
    };
};

/* TODO module Fuzz = {} */

module Moment = {

  type t = {
    precision: Precision.t,
    moment: MomentRe.Moment.t
  };

  let make = MomentRe.moment;

  /***
   Transit read & write helpers
   */
  let writerSpec =
    Transit.makeWriteHandler([@bs] {
      pub tag = () => "moment";
      pub rep = ({ precision, moment }, ()) =>
        Precision.writer(precision)(MomentRe.Moment.toJSON(moment));
    });

  let readerSpec = (moment) => {
    precision: Precision.reader(moment),
    moment: MomentRe.momentDefaultFormat(moment),
  };

};

module Interval = {
  type t = {
    moment: Moment.t,
    duration: Duration.t
  };

  /***
   Transit read & write helpers
   */
  let writerSpec =
    Transit.makeWriteHandler([@bs] {
      pub tag = () => "interval";
      /* TODO make legible range */
      pub rep = ({ moment, duration }, ()) => ( moment, duration )
    });

  let readerSpec = ((moment, duration)) => { moment, duration }

};

/*
   switch (match(string)) {
   | ...
   }
*/
module Time = {
  type t =
    | Instant
    | Duration(Duration.t)
    | Moment(Moment.t)
    | Interval(Interval.t) ;

  /*let fromJSON = (json) =>
    switch (Str.regexp({|hello \([A-Za-z]+\)|})) {
    | Interval.mak()
    }*/


  let writerSpec =
    Transit.makeWriteHandler([@bs] {
      pub tag = () => "interval";
      /* TODO make legible range */
      pub rep = ({ moment, duration }, ()) => ( moment, duration )
    });

  let readerSpec = ((moment, duration)) => { moment, duration }
};

let reader = Transit.reader({
  "handlers": {
    instant: Instant.readerSpec,
    duration: Duration.readerSpec,
    moment: Moment.readerSpec,
    interval: Interval.readerSpec,
   }
});

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
    "Instant", Instant.writerSpec,
    "Duration", Duration.writerSpec,
    "Moment", Moment.writerSpec,
    "Interval", Interval.writerSpec,
  ));


let write = v => Transit.write(writer, v);
let read = v => Transit.read(reader, v);

let encodedInstant = write(Instant.make());
let encodedDuration = write(Duration.make(1, `days));
let encodedMoment = write(Moment.make("2017"));

let decodedInstant = read(encodedInstant);
let decodedDuration = read(encodedDuration);
let decodedMoment = read(encodedMoment);


