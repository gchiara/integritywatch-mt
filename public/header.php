<nav class="navbar navbar-expand-lg navbar-light bg-light" id="iw-nav">
  <a class="navbar-brand" href="https://www.daphne.foundation" target="_blank"><img src="./images/daphne-foundation-logo.svg" alt="" /> </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a href="./" class="nav-link" :class="{active: page == 'donations'}">Political Donations</a>
      </li>
      <li class="nav-item">
        <a href="./declarations.php" class="nav-link" :class="{active: page == 'declarations'}">Declarations</a>
      </li>
      <li class="nav-item">
        <a href="./deposits.php" class="nav-link" :class="{active: page == 'deposits'}">Deposits</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          National versions
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="https://www.integritywatch.eu/" target="_blank">EU</a>
          <a class="dropdown-item" href="https://www.integritywatch.fr/" target="_blank">France</a>
          <a class="dropdown-item" href="https://www.integritywatch.gr/" target="_blank">Greece</a>
          <a class="dropdown-item" href="http://www.soldiepolitica.it/" target="_blank">Italy</a>
          <a class="dropdown-item" href="https://deputatiuzdelnas.lv/" target="_blank">Latvia</a>
          <a class="dropdown-item" href="https://manoseimas.lt/" target="_blank">Lithuania</a>
          <a class="dropdown-item" href="https://www.integritywatch.nl/" target="_blank">Netherlands</a>
          <a class="dropdown-item" href="http://varuhintegritete.transparency.si/" target="_blank">Slovenia</a>
          <a class="dropdown-item" href="https://integritywatch.es/" target="_blank">Spain</a>
          <a class="dropdown-item" href="https://openaccess.transparency.org.uk/" target="_blank">United Kingdom</a>
          <a class="dropdown-item" href="https://integritywatch.cl/" target="_blank">Chile</a>
        </div>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a href="./about" class="nav-link nav-link-about">About</a>
      </li>
    </ul>
  </div>
</nav>