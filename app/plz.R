options(java.parameters = "-Xmx7G")

library(utils)
library(zip)
library(r5r)
library(shiny)
library(ggplot2)
library(sf)
library(data.table)


Zip_Files <- list.files(path = "C:/xampp/htdocs/dashboard/src/test/", pattern = ".txt", full.names=TRUE)
zip::zipr(zipfile = "C:/xampp/htdocs/dashboard/src/gtfs/plzzip.zip", files = Zip_Files)


args <- commandArgs(TRUE)
lon<-as.numeric(args[1])
lat<-as.numeric(args[2])



path <- file.path("C:/xampp/htdocs/dashboard/src/gtfs/")
r5r_core <- setup_r5(data_path = path, verbose = FALSE, overwrite = TRUE)

points<- data.frame(id=c('1'),lon=c(lon),lat=c(lat))
head(points)

departure_datetime <- as.POSIXct(
  "13-08-2021 06:53:00",
  format = "%d-%m-%Y %H:%M:%S"
)

iso1 <- isochrone(r5r_core,
                  origin = points,
                  mode = "transit",
                  mode_egress = "WALK",
                  departure_datetime = departure_datetime,
                  cutoffs = seq(0, 100, 10)
)
head(iso1)
print(iso1)

file.remove('C:/xampp/htdocs/dashboard/src/temp.geojson') 
st_write(iso1, dsn = "C:/xampp/htdocs/dashboard/src/temp.geojson", layer = "temp.geojson")



