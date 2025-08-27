export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    get_level: IDL.Func([IDL.Principal], [IDL.Nat64], ["query"]),
    set_level: IDL.Func([IDL.Principal, IDL.Nat64], [], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
