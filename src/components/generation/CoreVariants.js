// export default function CoreVariants({ data }) {
//   if (!data) return null;

//   return (
//     <section style={{ paddingBottom: 8 }}>
//       <h2>Core Variants</h2>

//       {data.dieselVariants?.length > 0 && (
//         <>
//           <h3>Diesel</h3>
//           <ul>
//             {data.dieselVariants.map((v) => (
//               <li key={v}>{v}</li>
//             ))}
//           </ul>
//         </>
//       )}

//       {data.petrolVariants?.length > 0 && (
//         <>
//           <h3>Petrol</h3>
//           <ul>
//             {data.petrolVariants.map((v) => (
//               <li key={v}>{v}</li>
//             ))}
//           </ul>
//         </>
//       )}

//       {data.scopeNote && <p>{data.scopeNote}</p>}
//       <hr />
//     </section>
//   );
// }


import Link from "next/link";

export default function CoreVariants({ data }) {
  if (!data) return null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <h2 dangerouslySetInnerHTML={{ __html: "Core Variants" }} />

      {data.dieselVariants?.length > 0 && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: "Diesel" }} />
          <ul>
            {data.dieselVariants.map((v) => (
              <li key={v.url}>
                <Link
                  class=""
                  href={v.url}
                  dangerouslySetInnerHTML={{ __html: v.name }}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {data.petrolVariants?.length > 0 && (
        <>
          <h3 dangerouslySetInnerHTML={{ __html: "Petrol" }} />
          <ul>
            {data.petrolVariants.map((v) => (
              <li key={v.url}>
                <Link
                  href={v.url}
                  dangerouslySetInnerHTML={{ __html: v.name }}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {data.scopeNote && <div dangerouslySetInnerHTML={{ __html: data.scopeNote }} />}
      <hr />
    </section>
  );
}