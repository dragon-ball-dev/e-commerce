import React from "react";
import Admin from "../../asset/images/admin.jpg";

const Testimonials = () => {
  return (
    <section className="my-20">
      <h1 className="text-2xl text-center font-semibold dark:text-slate-100 mb-5 underline underline-offset-8">
        Thông tin về chúng tôi
      </h1>
      <div className="grid mb-8 rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2">
        <figure className="flex flex-col justify-center items-center p-8 text-center bg-white rounded-t-lg border-b border-gray-200 md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
          <blockquote className="mx-auto mb-4 max-w-2xl text-gray-500 lg:mb-8 dark:text-gray-400">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dễ dàng sử dụng
            </h3>
            <p className="my-4 font-light">
              
            </p>
          </blockquote>
          <figcaption className="flex justify-center items-center space-x-3">
            <img className="w-9 h-9 rounded-full" src={Admin} alt="user" />
            <div className="space-y-0.5 font-medium dark:text-white text-left">
              <div>Võ Giang Nam</div>
              <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                Khách hàng mua sắm
              </div>
            </div>
          </figcaption>
        </figure>
        <figure className="flex flex-col justify-center items-center p-8 text-center bg-white rounded-t-lg border-b border-gray-200 md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
          <blockquote className="mx-auto mb-4 max-w-2xl text-gray-500 lg:mb-8 dark:text-gray-400">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Giao diện bắt mắt
            </h3>
            <p className="my-4 font-light">
              
            </p>
          </blockquote>
          <figcaption className="flex justify-center items-center space-x-3">
            <img className="w-9 h-9 rounded-full" src={Admin} alt="user" />
            <div className="space-y-0.5 font-medium dark:text-white text-left">
              <div>Võ Giang Nam</div>
              <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                Khách hàng mua sắm
              </div>
            </div>
          </figcaption>
        </figure>
        <figure className="flex flex-col justify-center items-center p-8 text-center bg-white rounded-t-lg border-b border-gray-200 md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
          <blockquote className="mx-auto mb-4 max-w-2xl text-gray-500 lg:mb-8 dark:text-gray-400">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Đa dạng các loại sản phẩm
            </h3>
            <p className="my-4 font-light">
              
            </p>
          </blockquote>
          <figcaption className="flex justify-center items-center space-x-3">
            <img className="w-9 h-9 rounded-full" src={Admin} alt="user" />
            <div className="space-y-0.5 font-medium dark:text-white text-left">
              <div>Võ Giang Nam</div>
              <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                Khách hàng mua sắm
              </div>
            </div>
          </figcaption>
        </figure>
        <figure className="flex flex-col justify-center items-center p-8 text-center bg-white rounded-t-lg border-b border-gray-200 md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
          <blockquote className="mx-auto mb-4 max-w-2xl text-gray-500 lg:mb-8 dark:text-gray-400">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tiếp cận tốt với người dùng
            </h3>
            <p className="my-4 font-light">
              
            </p>
          </blockquote>
          <figcaption className="flex justify-center items-center space-x-3">
            <img className="w-9 h-9 rounded-full" src={Admin} alt="user" />
            <div className="space-y-0.5 font-medium dark:text-white text-left">
              <div>Võ Giang Nam</div>
              <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                Khách hàng mua sắm
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Testimonials;
