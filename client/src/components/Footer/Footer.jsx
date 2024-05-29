import SubscriptionForm from "../Article/SubscriptionForm";

const Footer = () => {
  return (
    <footer className="bg-yellow-400 py-6 sm:px-5 xs:px-2 flex justify-between space-x-16 items-center md:items-center">
      <div>
        <div className="flex items-center mb-5 md:mb-0">
          <i className="fa fa-copyright sm:fa-2x mr-2" aria-hidden="true"></i>
          <h3 className="sm:text-lg font-bold xs:text-xs">realbabstore</h3>
        </div>
        <div className="flex items-center xs:space-x-2 sm:space-x-5 mt-5 md:mt-0">
          <i className="fa fa-facebook-official fa-2x text-blue-600" aria-hidden="true"></i>
          <i className="fa fa-whatsapp fa-2x text-green-600" aria-hidden="true"></i>
          <i className="fa fa-instagram fa-2x text-pink-600" aria-hidden="true"></i>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-5 xs:justify-between">
        <div className="mb-5 md:mb-0">
          <h2 className="font-extrabold">Newsletter</h2>
          <p className="w-full lg:w-96 xs:w-48 mb-3">
            Subscribe to our weekly newsletter to receive exclusive tips on the best fragrances and updates on our latest Jalabs features.
            We value your privacy and will never send you spam or share your email address.
          </p>
          <SubscriptionForm />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
