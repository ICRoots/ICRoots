export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    event_bus: IDL.Opt(IDL.Principal),
    admin: IDL.Opt(IDL.Principal),
    loans: IDL.Opt(IDL.Principal),
  });
  return IDL.Service({
    deposit_mock: IDL.Func([IDL.Principal, IDL.Nat], [], []),
    get_collateral: IDL.Func([IDL.Principal], [IDL.Nat], ["query"]),
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
