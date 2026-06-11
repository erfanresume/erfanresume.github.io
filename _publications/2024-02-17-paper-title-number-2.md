---
title: "IMICLiVAN: An Improved Method to Increase Cluster Lifetime in Vehicular Ad Hoc Networks (VANETs)"
collection: publications
category: manuscripts
permalink: /publication/2024-02-17--paper-title-number-2
excerpt: 'Published.'
date: 2026-04-03
venue: 'The Journal of Supercomputing, Springer Nature'
paperurl: 'https://link.springer.com/article/10.1007/s11227-026-08358-z'
citation: 'Moghadam, E., Asghari, E., Asghari, S.A. et al. IMICLiVAN: an improved method to increase cluster lifetime in vehicular ad hoc networks (VANETs). J Supercomput 82, 319 (2026). https://doi.org/10.1007/s11227-026-08358-z'
---

Vehicular ad hoc networks (VANETs) represent a transformative technology that 
enhances road safety, optimizes traffic flow, and enables efficient communication 
between vehicles and infrastructure. However, vehicular environments’ dynamic and 
unpredictable nature presents significant challenges, including frequent cluster head 
(CH) changes, increased communication overhead, and limited network lifetime. 
These issues degrade overall network performance and hinder the practical deploy
ment of VANETs in real-world scenarios. This paper introduces IMICLiVAN, an 
enhanced clustering mechanism designed to address these challenges. The proposed 
method integrates the K-means algorithm with the silhouette score to dynamically 
determine the optimal number of clusters, ensuring compact and stable cluster struc
tures. Additionally, a weighted formula for CH selection is employed, designed to 
balance multiple metrics to improve cluster stability and reduce unnecessary clus
ter head changes, and minimize reformation overhead. The performance of IMI
CLiVAN was evaluated through simulation-based experiments under varying traffic 
densities. Simulation results demonstrate that IMICLiVAN significantly outperforms 
existing clustering methods across key metrics, including WTCHS, ECBLTR, and 
EKSGA. These findings establish IMICLiVAN as a practical and effective solution 
for enhancing VANET performance in dynamic environments. From a supercom
puting perspective, the per-step clustering quality evaluation (silhouette-based selec
tion over multiple candidate-K values) and distance-driven computations become 
increasingly demanding in dense or city-scale VANETs; therefore, IMICLiVAN is 
designed to be amenable to parallel and distributed execution (e.g., RSU/MEC or 
cloud/HPC backends) to help meet strict latency constraints in real-time operation.
