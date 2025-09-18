export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    event_bus: IDL.Opt(IDL.Principal),
    admin: IDL.Opt(IDL.Principal),
    loans: IDL.Opt(IDL.Principal),
  });
  return IDL.Service({
    get_level: IDL.Func([IDL.Principal], [IDL.Nat], ["query"]),
    set_level: IDL.Func([IDL.Principal, IDL.Nat], [], []),
  });
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    event_bus: IDL.Opt(IDL.Principal),
    admin: IDL.Opt(IDL.Principal),
    loans: IDL.Opt(IDL.Principal),
  });
  return [IDL.Opt(InitArgs)];
};
