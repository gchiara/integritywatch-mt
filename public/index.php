<html lang="en">
<head>
  <?php include 'gtag.php' ?>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Integrity Watch Malta</title>
  <meta property="og:url" content="https://iw.daphne.foundation" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Integrity Watch Malta" />
  <meta property="og:description" content="Integrity Watch Malta" />
  <meta property="og:image" content="https://iw.daphne.foundation/images/thumbnail.jpg" />
  <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="fonts/oswald.css">
  <link rel="stylesheet" href="static/donations.css?v=10">
</head>
<body>
    <div id="app" class="donations-page">   
      <?php include 'header.php' ?>
      <!-- TOP AREA -->
      <div class="container-fluid top-description-container" v-if="showInfo">
        <div class="row">
          <div class="col-md-12 top-description-content">
            <div class="top-description-text">
              <h1>Integrity Watch Malta | Political donations</h1>
              <h2>This is a user-friendly interactive database that provides a unique overview of political donations from 2016 to 2019.</h2>
              <a class="read-more-btn" href="./about.php?section=4">Read more</a>
              <button class="social-share-btn twitter-btn" @click="share('twitter')"><img src="./images/twitter-nobg.png" />Share on Twitter</button>
              <button class="social-share-btn  facebook-btn" @click="share('facebook')"><img src="./images/facebook-nobg.png" />Share on Facebook</button>
              <p>By simply clicking on the graph or list below users can rank, sort and filter the donations. To refresh the data and start over, click the 'Reset Filters' button.
                <br />To make navigation easier, you may click <a href="Integrity Watch (Malta) User Manual.pdf" target="_blank">here</a> to access the user manual.
              </p>
            </div>
            <i class="material-icons close-btn" @click="showInfo = false">close</i>
          </div>
        </div>
      </div>
      <!-- MAIN -->
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container donations_1">
              <chart-header :title="charts.party.title" :info="charts.party.info" ></chart-header>
              <div class="chart-inner" id="party_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container donations_2">
              <chart-header :title="charts.donors.title" :info="charts.donors.info" ></chart-header>
              <div class="chart-inner" id="donors_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container donations_3">
              <chart-header :title="charts.type.title" :info="charts.type.info" ></chart-header>
              <div class="chart-inner" id="type_chart"></div>
            </div>
          </div>
          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.table.title" :info="charts.table.info" ></chart-header>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">Nr</th> 
                      <th class="header">Party</th> 
                      <th class="header">Type</th> 
                      <th class="header">Donor</th>
                      <th class="header">Period</th> 
                      <th class="header">Year</th> 
                      <th class="header">Amount in €</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom bar -->
      <div class="container-fluid footer-bar">
        <div class="row">
          <div class="footer-col col-8 col-sm-4">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filter by party or donor ...">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>out of <strong class="total-count">0</strong> entries
            </div>
            <div class="count-box count-box-donations">
              <div class="filter-count nbdonations">0</div>out of <strong class="total-count-donations">0</strong> donations
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Reset filters</span></button>
      </div>
      <!-- DETAILS MODAL -->
      <div class="modal" id="detailsModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title">
                <div class="name">{{ selectedEl.Amount }} to {{ selectedEl.Party }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line" v-if="selectedEl.Donor && selectedEl.Donor != ''"><span class="details-line-title">Donor:</span> {{ selectedEl.Donor }}</div>
                    <div class="details-line" v-else><span class="details-line-title">Donor:</span> /</div>
                    <div class="details-line"><span class="details-line-title">Period:</span> {{ selectedEl.Period }}</div>
                    <div class="details-line"><span class="details-line-title">Year:</span> {{ selectedEl.Year }}</div>
                    <div class="details-line"><span class="details-line-title">Type:</span> {{ selectedEl.Type_of_Donation }}</div>
                    <div class="details-line"><span class="details-line-title">Number of donations:</span> {{ selectedEl.Number_of_Donations }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="''" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>

    <script src="static/donations.js?v=10"></script>

 
</body>
</html>