+++
title = "One repository is not enough"
date = "2025-03-03 17:00:00 +0100"
weight = 1
chapter = false
+++

<!-- This empty tag is required to render the math blocks below -->
```math
```

Plakar offers a simple way to synchronize repositories across multiple locations. Two questions often arise: "Why do I need more than one copy?" and "How many copies should I have?"

## Why do I need more than one copy?

If you store your data at a single location, you are at risk of losing everything if that storage fails. This can happen due to various reasons, such as:

* **Hardware failure:** The device's components can fail due to wear and tear, overheating, or other issues.
* **Power surges:** Unexpected power surges can damage the device and corrupt the data.
* **Natural disasters:** Fires, floods, earthquakes, or other natural disasters can destroy the device and the data stored on it.
* **Theft:** The device can be stolen, and the data can be lost or compromised.

Hardware failures are not the only risk to your data. Human errors can also lead to data loss. Some common scenarios include:

* **Accidental deletion:** A system administrator can accidentally remove the data.
* **Intentional deletion:** A malicious actor can delete the data to cause harm.
* **Internal threats:** While rare, internal threats can also lead to data loss.

A good backup strategy should account for these risks.

## How many copies should I have?

> Literature and empirical studies suggest that the annual probability of data loss at a single site—especially when considering factors like hardware failures, human error, and environmental risks—is typically in the low single-digit percentages.
> 
> For example, a seminal study by Pinheiro, Weber, and Barroso (2007) titled ["Failure Trends in a Large Disk Drive Population"](https://static.googleusercontent.com/media/research.google.com/en//archive/disk_failures.pdf) found that hard drive failure rates generally fall in the range of 2% to 4% per year.
> 
> In practice, when additional risks beyond basic hardware failure (such as accidental deletion or other operational issues) are factored in, many practitioners adopt a conservative estimate of around 5% per year for a single site.
>

Assuming that the annual probability of data loss at a single site is \( p = 0.05 \) (5%).

### For a single set of data

The annual probability of loss is simply:

$$p = 0.05$$

which corresponds to a **1 in 20 chance** of losing the data.
 
### For two copies at distinct sites

With two copies at distinct sites,
data is only lost if both sites lose their copies simultaneously.

If we assume that each site's failure occurs uniformly at random over 365 days. The daily failure probability for a single site is:

$$\frac{p}{365}$$

Thus, the probability that both copies fail on the same day is:

$$\left(\frac{p}{365}\right)^2$$

Since there are 365 days in a year, the annual probability of a simultaneous failure is approximately:

$$365 \times \left(\frac{p}{365}\right)^2 = \frac{p^2}{365}$$

For p=0.05, this becomes:

$$\frac{0.0025}{365} \approx 6.85 \times 10^{-6}$$

which corresponds to roughly a **1 in 145,000 chance** of both copies failing on the same day over the course of a year.


### For three copies at distinct sites

Similarly, the probability that all three copies fail on the same day is:

$$\left(\frac{p}{365}\right)^3$$

Over the year, the probability becomes:

$$365 \times \left(\frac{p}{365}\right)^3 = \frac{p^3}{365^2}$$

For \( p = 0.05 \), this calculates to:

$$\frac{0.000125}{133225} \approx 9.38 \times 10^{-10}$$

or roughly a **1 in 1 billion chance**.

---

These calculations show that while data loss at a single site is a very likely scenario,
the odds reduce drastically with a second copy at a distinct site and become irrelevant with a third copy at a third site.

**It is generally recommended to have the live data + 2 off-site copies to fall in the unlikely 1 in a billion chance range.** This is also known as the 3-2-1 backup strategy.