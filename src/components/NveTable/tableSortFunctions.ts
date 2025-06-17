import { SorterType } from "./table.types";

/**
 *  Enkel sorteringsfunksjon som tar inn en funksjon som henter ut verdien som skal sorteres på.
 * Brukes for en tableHeader i NveTable, f.eks denne som sorterer på saksnummer og dokumentnummer: 
 * 
 *      sort: (sorter) => {
            const sF = sortByFunction<Kontrollgrunnlag>(sorter.direction, false);
            return (a, b) => sF(a, b, (d) => `${d.saksnummer}-${d.dokumentnummer}`);
        },
 * 
 * 
*/
export const sortByFunction = <T>(
  direction: "ASC" | "DESC",
  isNumeric?: boolean
) => {
  return (itemA: T, itemB: T, func: (arg: T) => string | number | null) => {
    const a = func(itemA);
    const b = func(itemB);
    let sortN;
    if (isNumeric) {
      if (typeof a === "number" && typeof b === "number") {
        sortN = a - b;
      } else {
        sortN = (a ?? "")
          .toString()
          .localeCompare((b ?? "").toString(), "no", { numeric: true });
      }
    } else {
      sortN = (a ?? "").toString().localeCompare((b ?? "").toString(), "no");
    }
    return direction === "ASC" ? sortN : sortN * -1;
  };
};

/** Enkel sorteringsfunksjon som gjør en numeric eller tekstbasert sammenligning mellom to verdier 
 * 
 * Brukes for en tableHeader i NveTable, f.eks denne som sorterer på statuskode
 * 
 *      sort: (sorter) => {
            const sF = sortByProperty(sorter.direction);
            return (a: Kontroll, b: Kontroll) => sF(a["statuskode"], b["statuskode"]);
        },
 * 
 * 
*/
export const sortByProperty = (
  direction: "ASC" | "DESC",
  isNumeric?: boolean
) => {
  return (
    a: string | number | null | Date,
    b: string | number | null | Date
  ) => {
    let sortN;
    if (isNumeric) {
      if (typeof a === "number" && typeof b === "number") {
        sortN = a - b;
      } else {
        sortN = (a ?? "")
          .toString()
          .localeCompare((b ?? "").toString(), "no", { numeric: true });
      }
    } else if (a instanceof Date && b instanceof Date) {
      sortN = a.getTime() - b.getTime();
    } else {
      sortN = (a ?? "").toString().localeCompare((b ?? "").toString(), "no");
    }
    return direction === "ASC" ? sortN : sortN * -1;
  };
};

/**
 * Veldig enkel funksjon for sortering. Bare send inn accessor og resten skal fikses
 * @returns
 */
export const simpleSortByAccessor = <T extends Record<string, any>>(
  accessor: (item: T) => string,
  isNumeric?: boolean
) => {
  return (sorter: SorterType) => {
    const sortFn = sortByProperty(sorter.direction, isNumeric);
    return (a: T, b: T) => sortFn(accessor(a), accessor(b));
  };
};
