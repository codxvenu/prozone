
import React from 'react';
import VerticalNav from '../home/verticalnav';
import HorizontalNav from '../home/horizontal';
import "./page.css"
function Profile() {
 

  return (
    <div className="app">
      <VerticalNav />
      <div className="main-content">
        <HorizontalNav />
        <div className="main-form">
          <div>

         
          <h1 className='mb-10 text-3xl text-center text-red-300' >Rules</h1>
          <p>1. If you are using our services, you automatically Agree to all our terms!</p>
      <p>2. We can refuse to serve and BAN any user without explanation!</p>
      <p>3. Most refunds in automated mode. You must check card to have refund!</p>
      <p>4. You may choose one of available checkers. Checker providers we currently have:<br />
        * 4check<br />
        * Luxchecker.
      </p>
      <p>5. All our SHOPS & Sellers except SHOP 2 have AVS option (read about AVS here) which will help to check and get correct address of CARD HOLDER. Each our checker has several type of check modes such as:<br />
        * ZERO CHECK<br />
        * AUTHORIZE<br />
        * DUMPS CHECK<br />
        NOTE: OUR CHECKERS could kill maximum 20% of checked cards which means you can get minimum 80% of validity with us.
      </p>
      <p>6. When you are done with purchase all orders move to MY ORDERS PAGE. You must move to MY ORDERS page to see, check, refund your orders.</p>
      <p>7. You can buy only through checker and only valid cards. We understand that checkers can kill cards but it kills not more than 20% so you will get minimum of 80% validity at the end point and cheap price will cover your losses!!!</p>
      <p>8. Some bases are NON REFUNDABLE and have no check time or CHECK option those cards from higher valid rate bases but not 100% valid. Those bases calculated that valid cards benefit will cover invalid cards loss. Please read carefully if card is REFUNDABLE or NONREFUNDABLE before you buy it, we show that info in cards search page. We also provide you the option to search and find ONLY REFUNDABLE or NONREFUNDABLE cards, you can filter those options in EXTENDED OPTION filter.</p>
      <p>9. If the Card is "Approved", you pay a fee of $1 per check. If the card is "Declined", you pay nothing for check and you get auto-refund!</p>
      <p>10. If checker has shown "Approved" cards can't be refunded or changed. Please do not write tickets about it. They will be ignored.</p>
      <p>11. Claims for the checker cannot be accepted!!!</p>
      <p>12. Please check card(s) by yourself before creating a card validity claim ticket.</p>
      <p>13. Please save all cards on your own side - we periodically delete old bases.</p>
      <p>14. Do not ask in tickets to add any BINs or Countries, these messages will be ignored!</p>
      <p>15. We do not have a moneyback guarantee.</p>
      <p>16. If you cannot access the main page by clear net domain - try to access by Tor MDS domains you have been provided.</p>
      <p>17. If you have other questions about functionality, or any suggestions, etc., please write a ticket. All tickets will be answered!</p>
      <p>18. We don't guarantee any balance on cards you purchased. We cannot refund or replace card for this reason.</p>
      <p>19. If the card doesn't have verified by Visa or any other 3D security bypass, we cannot replace or refund such cards.</p>
      <p>20. After sending payment, your balance will be refilled automatically after 1 confirmation in the blockchain system.</p>
      <p>21. Bitcoin confirmation could take from several minutes to much longer. Set a higher transaction fee to get faster confirmation.</p>
      <p>22. We don’t save any of your connection logs.</p>
      <p>23. We encrypt all of your data. You are safe with us.</p>
      <p>24. NON REFUNDABLE CVV (except Benumb base) can be refunded only under the following conditions:<br />
        a . Within 10 minutes after purchase has been made you have to check that card in our checker service and if card shows invalid we will refund!!!<br />
        b.  Write any good feedback about our marketplace in any carding forum, group, etc., and provide us with screenshots. You can even gain a bonus with good feedback, not only a refund!!!
      </p>
      <p>25. Base "Shop: Benumb" without any refund!<br />
        * When registering, the User agrees to any Rules related to the use of the shop.<br />
        * Prozone shop is not responsible for your use of any product from our shop.<br />
        * For insulting a brand or team, you get a ban.<br />
        * User has no right to threaten, blackmail, or extort anything.
      </p>
      <p>26. Please try to upload at least $50 with either BTC or LTC.</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Profile;
