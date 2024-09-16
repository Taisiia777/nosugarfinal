import { Heading, Button, Text } from "../../components";
import React from "react";

export default function IPhone1415Pro1Row({
  productname = "Название продукта",
  productimage = "*Изображение*",
  addtocartbutton = "В КОРЗИНУ",
  productprice = "999 RUB",
  ...props
}) {
  return (
    <div {...props} className={`${props.className} flex items-center w-full p-[7px]`}>
      <div className="flex w-full flex-col items-end gap-7 self-end">
        <Text as="p" className="mr-[19px]">
          {productname}
        </Text>
        <Heading size="headingxs" as="p" className="mr-6 !text-white-a700_19">
          {productimage}
        </Heading>
        <div className="flex items-center gap-4 self-stretch">
          <Button shape="round" className="min-w-[89px] !rounded-[12px]">
            {addtocartbutton}
          </Button>
          <Heading size="headingxs" as="p">
            {productprice}
          </Heading>
        </div>
      </div>
    </div>
  );
}
