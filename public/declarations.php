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
  <link rel="stylesheet" href="static/declarations.css?v=6">
</head>
<body>
    <div id="app" class="declarations-page">   
      <?php include 'header.php' ?>
      <!-- TOP AREA -->
      <div class="container-fluid top-description-container" v-if="showInfo">
        <div class="row">
          <div class="col-md-12 top-description-content">
            <div class="top-description-text">
              <h1>Integrity Watch Malta | Declarations</h1>
              <h2>This is a user-friendly interactive database that provides a unique overview of MPs' declarations.</h2>
              <a class="read-more-btn" href="./about.php?section=4">Read more</a>
              <button class="social-share-btn twitter-btn" @click="share('twitter')"><img src="./images/twitter-nobg.png" />Share on Twitter</button>
              <button class="social-share-btn  facebook-btn" @click="share('facebook')"><img src="./images/facebook-nobg.png" />Share on Facebook</button>
              <p>By simply clicking on the graph or list below users can rank, sort and filter the donations.</p>
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
            <div class="boxed-container chart-container declarations_1">
              <chart-header :title="charts.topDeposits.title" :info="charts.topDeposits.info" ></chart-header>
              <div class="chart-inner" id="topdeposits_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container declarations_2">
              <chart-header :title="charts.partyDeposits.title" :info="charts.partyDeposits.info" ></chart-header>
              <div class="chart-inner" id="partydeposits_chart"></div>
            </div>
          </div>
          <div class="col-md-4 chart-col">
            <div class="boxed-container chart-container declarations_3">
              <chart-header :title="charts.professions.title" :info="charts.professions.info" ></chart-header>
              <div class="chart-inner" id="professions_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container declarations_4">
              <chart-header :title="charts.investments.title" :info="charts.investments.info" ></chart-header>
              <div class="chart-inner" id="investments_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container declarations_5">
              <chart-header :title="charts.properties.title" :info="charts.properties.info" ></chart-header>
              <div class="chart-inner" id="properties_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container declarations_6">
              <chart-header :title="charts.associations.title" :info="charts.associations.info" ></chart-header>
              <div class="chart-inner" id="associations_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container declarations_7">
              <chart-header :title="charts.otherInterests.title" :info="charts.otherInterests.info" ></chart-header>
              <div class="chart-inner" id="otherinterests_chart"></div>
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
                      <th class="header">Name</th> 
                      <th class="header">Party</th> 
                      <th class="header">Deposits minus loans in euros</th>
                      <th class="header">Declaration Date for year 2022</th>
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
              <input type="text" id="search-input" placeholder="Filter by name or party ...">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>out of <strong class="total-count">0</strong> MPs
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
                <div class="name">{{ selectedEl.fullname }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line"><span class="details-line-title">Party:</span> {{ selectedEl.Political_Party }}</div>
                    <div class="details-line"><span class="details-line-title">Declaration date:</span> {{ selectedEl.Declaration_Date }}</div>
                    <div class="details-line"><span class="details-line-title">Deposits total (€):</span> {{ selectedEl.depositsTot }}</div>
                    <div class="details-line" v-if="selectedEl.Gross_Income_EUR"><span class="details-line-title">Gross income (€):</span> {{ selectedEl.Gross_Income_EUR }}</div>
                    <div class="details-line" v-if="selectedEl.professionStrings && selectedEl.professionStrings.length > 0"><span class="details-line-title">Profession:</span> {{ selectedEl.professionStrings.join(', ') }}</div>
                  </div>
                  <div class="col-md-12">
                    <!-- Divider -->
                    <div class="modal-divider"></div>
                    <!-- Sub-Table 1 -->
                    <div>
                      <div class="modal-table-title">Deposits</div>
                      <table class="modal-table" v-if="selectedEl && selectedEl.deposits && selectedEl.deposits.length > 0">
                        <thead><tr><th>Description</th><th>Bank</th><th>Amount (EUR)</th><th>Declaration Date</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedEl.deposits">
                            <td>{{ el.Description }}</td>
                            <td>{{ el.Bank }}</td>
                            <td>{{ el.Amount }}</td>
                            <td>{{ el['Declaration Date'] }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else><i>Not declared or not applicable.</i></div>
                    </div>
                    <!-- Sub-Table 2 -->
                    <div>
                      <div class="modal-table-title">Directorships or Associations</div>
                      <table class="modal-table" v-if="selectedEl && selectedEl.directorshipsOrAssociations && selectedEl.directorshipsOrAssociations.length > 0">
                        <thead><tr><th>Entity</th><th>Position</th><th>Declaration Date</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedEl.directorshipsOrAssociations">
                            <td>{{ el.Entity }}</td>
                            <td>{{ el.Position }}</td>
                            <td>{{ el.Declaration_Date }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else><i>Not declared or not applicable.</i></div>
                    </div>
                    <!-- Sub-Table 3 -->
                    <div>
                      <div class="modal-table-title">Employment</div>
                      <table class="modal-table" v-if="selectedEl && selectedEl.employment && selectedEl.employment.length > 0">
                        <thead><tr><th>Position</th><th>Employer</th><th>Start</th><th>End</th><th>Declaration Date</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedEl.employment">
                            <td>{{ el.Employment }}</td>
                            <td>{{ el.Employer }}</td>
                            <td>{{ el.Start_Month }} {{ el.Start_Year }}</td>
                            <td>{{ el.End_Month }} {{ el.End_Year }}</td>
                            <td>{{ el.Declaration_Date }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else><i>Not declared or not applicable.</i></div>
                    </div>
                    <!-- Sub-Table 4 -->
                    <div>
                      <div class="modal-table-title">Investments</div>
                      <table class="modal-table" v-if="selectedEl && selectedEl.investments && selectedEl.investments.length > 0">
                        <thead><tr><th>Company</th><th>Share</th><th>Description</th><th>Declaration Date</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedEl.investments">
                            <td>{{ el.Company }}</td>
                            <td>{{ el.Share }}</td>
                            <td>{{ el.Description }}</td>
                            <td>{{ el.Declaration_Date }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else><i>Not declared or not applicable.</i></div>
                    </div>
                    <!-- Sub-Table 5 -->
                    <div>
                      <div class="modal-table-title">Properties</div>
                      <table class="modal-table" v-if="selectedEl && selectedEl.properties && selectedEl.properties.length > 0">
                        <thead><tr><th>Property</th><th>Obtained</th><th>Use</th><th>Connection</th><th>Declaration Date</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedEl.properties">
                            <td>{{ el.Property }}</td>
                            <td>{{ el.Obtained }}</td>
                            <td>{{ el.Use }}</td>
                            <td>{{ el.Connection }}</td>
                            <td>{{ el.Declaration_Date }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else><i>Not declared or not applicable.</i></div>
                    </div>
                    <!-- Sub-Table 6 -->
                    <div>
                      <div class="modal-table-title">Other financial interests</div>
                      <table class="modal-table" v-if="selectedEl && selectedEl.otherFinancialInterests && selectedEl.otherFinancialInterests.length > 0">
                        <thead><tr><th>Detail</th><th>Amount</th><th>Declaration Date</th></tr></thead>
                        <tbody>
                          <tr v-for="el in selectedEl.otherFinancialInterests">
                            <td>{{ el.Detail }}</td>
                            <td>{{ el.Amount }}</td>
                            <td>{{ el.Declaration_Date }}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="modal-table-else" v-else><i>Not declared or not applicable.</i></div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="'Lorem ipsum sit dolor amet.'" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>

    <script src="static/declarations.js?v=6"></script>

 
</body>
</html>