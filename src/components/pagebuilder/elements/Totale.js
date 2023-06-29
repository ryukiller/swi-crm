const Totale = ({ content, icon, ...props }) => {
  return (
    <div className="flex flex-row items-center justify-between my-2">
      <div></div>
      <div className=""></div>
      <div>
        <div>{content}: € 4.500,00 + IVA</div>
        <p className="text-right text-xs font-light">(valido per 10 anni)</p>
      </div>
    </div>
  );
};

export default Totale;
